/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ginndex.titulos.control;

import com.ginndex.titulos.modelo.ReporteDGAIR;
import com.ginndex.titulos.modelo.TETitulosCarreras;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 *
 * @author BSorcia
 */
public class CReporteDGAIR {

    private HttpServletRequest request;
    private String Id_Usuario;
    private String bandera;
    private CConexion conexion;
    private String permisos;
    private Connection con;
    private List<String> lstEncabezados;
    String NombreInstitucion;
    SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public String establecerAcciones() throws UnsupportedEncodingException {
        String RESP = "";
        //long startTime = System.nanoTime();
        bandera = request.getParameter("txtBandera") == null ? "0" : request.getParameter("txtBandera");
        HttpServletRequest requestProvisional = request;
        requestProvisional.setCharacterEncoding("UTF-8");

        HttpSession sessionOk = request.getSession();
        Id_Usuario = sessionOk.getAttribute("Id_Usuario").toString();
        conexion = new CConexion();
        conexion.setRequest(request);
        CPermisos cPermisos = new CPermisos();
        cPermisos.setRequest(request);
        permisos = cPermisos.obtenerPermisos("Reporte DGAIR");
        switch (bandera) {
            case "1":
                RESP = consultarListaCarreras();
                break;
            case "2":
                RESP = armarReporte();
                break;
        }
        return RESP;
    }

    private String consultarListaCarreras() {
        String htmlListaCarrera = "<option value='0' data-cve=''>Todas</option>";
        List<TETitulosCarreras> lstCarreras = new ArrayList<>();
        try {
            String query = "SELECT id_carrera,Id_Carrera_Excel,nombreCarrera,cveCarrera FROM TETitulosCarreras ORDER BY Id_Carrera_Excel";
            ResultSet rs;
            con = conexion.GetconexionInSite();
            rs = con.prepareStatement(query).executeQuery();
            while (rs.next()) {
                TETitulosCarreras carrera = new TETitulosCarreras();

                carrera.setID_Carrera(rs.getString("id_carrera"));
                carrera.setId_Carrera_Excel(rs.getString("id_carrera_excel"));
                carrera.setNombreCarrera(rs.getString("nombreCarrera"));
                carrera.setClaveCarrera(rs.getString("cveCarrera"));

                lstCarreras.add(carrera);
            }

            htmlListaCarrera = lstCarreras.stream().map(elemento -> "<option value='" + elemento.getId_Carrera_Excel() + "'>" + elemento.getId_Carrera_Excel() + " - " + elemento.getNombreCarrera() + "</option>")
                    .reduce(htmlListaCarrera, String::concat);

        } catch (SQLException ex) {
            Logger.getLogger(CReportes.class.getName()).log(Level.SEVERE, null, ex);
        }
        return htmlListaCarrera;
    }

    private String armarReporte() {
        if (permisos.contains("acceso") && !permisos.split("¬")[1].equalsIgnoreCase("1")) {
            return "notAllowed";
        }
        String resp = "";
        List<ReporteDGAIR> lstDatosReporte = new ArrayList<>();
        ResultSet rs;

        String fechaInicio = request.getParameter("fi");
        String fechaFin = request.getParameter("ff");
        String idCarrera = request.getParameter("carrera");
        String tipoReporte = request.getParameter("opt");
        String mostrarPromedioGeneral = request.getParameter("promedio");
        String mostrarFolioControl = request.getParameter("folio");

        String query = "set dateformat dmy;SELECT 'Certificado de estudios' as Estatus, year(fechaExpedicion) as 'Año del ciclo escolar',\n"
                + "CURP,Promedio as 'Promedio General',(CASE WHEN idTipoCertificado = 79 THEN 'Certificado Total' ELSE 'Certificado Parcial' END) AS 'Tipo de documento',fechaExpedicion,\n"
                + "FORMAT (fechaExpedicion,'yyyyMMdd') AS 'Fecha Expedición del documento',folioControl as 'Folio del documento'\n"
                + "FROM TECERTIFICADOELECTRONICO tce JOIN Alumnos a on tce.id_profesionista = a.ID_Alumno JOIN PERSONA p on a.ID_Persona = p.Id_Persona\n"
                + "WHERE tce.estatus = 1 " + (!idCarrera.equalsIgnoreCase("0") ? " AND tce.Id_Carrera_Excel = " + idCarrera : "") + " AND (fechaExpedicion\n"
                + " between  '" + fechaInicio + "' AND '" + fechaFin + "')\n"
                + "UNION\n"
                + "SELECT 'Título' as Estatus, year(fechaExpedicion) as 'Año del ciclo escolar',\n"
                + "CURP,(SELECT  CAST(AVG(CASE WHEN m.tipo <>266  THEN C.Calificacion ELSE 0 END) AS decimal(5,2)) promedio\n"
                + "                            FROM Calificaciones AS C \n"
                + "                            JOIN Alumnos AS A ON A.ID_Alumno = C.ID_Alumno \n"
                + "                            JOIN Carrera AS CA ON CA.ID_Carrera = A.ID_Carrera \n"
                + "                            JOIN Materias AS M ON M.ID_Materia = C.ID_Materia \n"
                + "                            WHERE C.ID_Alumno = id_profesionista AND C.ID_Materia \n"
                + "                            IN (\n"
                + "                            SELECT ID_Materia \n"
                + "                            FROM Materias AS M \n"
                + "                            JOIN Curso AS CU ON CU.ID_Curso = M.ID_Curso \n"
                + "                            WHERE CU.ID_Carrera = tte.id_carrera)) as 'Promedio General',\n"
                + "							(CASE WHEN car.Descripcion like '%Licenciatura%' THEN 'Título Profesional' \n"
                + "							   ELSE (CASE WHEN (car.Descripcion like '%Maestría%' OR car.Descripcion like '%Doctorado%') THEN 'Grado' \n"
                + "							      ELSE (CASE WHEN car.Descripcion like 'Especialidad%' THEN 'Diploma' ELSE 'No identificado' END )\n"
                + "							   END) \n"
                + "							END) AS 'Tipo de documento',fechaExpedicion,\n"
                + "FORMAT (fechaExpedicion,'yyyyMMdd') AS 'Fecha Expedición del documento',folioControl as 'Folio del documento'\n"
                + "FROM TETituloElectronico tte JOIN Alumnos a on tte.id_profesionista = a.ID_Alumno JOIN PERSONA p on a.ID_Persona = p.Id_Persona\n"
                + "JOIN TETitulosCarreras ttc ON tte.id_carrera = ttc.id_carrera JOIN Carrera car on ttc.Id_Carrera_Excel = car.Id_Carrera_Excel\n"
                + "WHERE tte.estatus = 1 " + (!idCarrera.equalsIgnoreCase("0") ? " AND ttc.Id_Carrera_Excel = " + idCarrera : "") + " AND (fechaExpedicion\n"
                + " between  '" + fechaInicio + "' AND '" + fechaFin + "')";

        try {
            con = conexion.GetconexionInSite();
            rs = con.prepareStatement(query).executeQuery();

            while (rs.next()) {
                ReporteDGAIR reporte = new ReporteDGAIR();

                reporte.setEstatus(rs.getString("Estatus"));
                reporte.setAnioCicloEscolar(rs.getString("Año del ciclo escolar"));
                reporte.setCurp(rs.getString("CURP"));
                reporte.setPromedioGeneral(rs.getString("Promedio General"));
                reporte.setTipoDocumento(rs.getString("Tipo de documento"));
                reporte.setFechaExpedicionDocumento(rs.getString("Fecha Expedición del documento"));
                reporte.setFolioDocumento(rs.getString("Folio del documento"));

                lstDatosReporte.add(reporte);
            }
            List<ReporteDGAIR> lstFiltro;
            if (tipoReporte.equalsIgnoreCase("1")) {
                //solo titulos
                lstFiltro = lstDatosReporte.stream().filter(datos -> datos.getEstatus().equalsIgnoreCase("Título")).collect(Collectors.toList());
            } else if (tipoReporte.equalsIgnoreCase("2")) {
                //solo certificados
                lstFiltro = lstDatosReporte.stream().filter(datos -> datos.getEstatus().equalsIgnoreCase("Certificado de estudios")).collect(Collectors.toList());
            } else {
                //ambos
                lstFiltro = lstDatosReporte;
            }
            resp = generarExcel(lstFiltro, mostrarPromedioGeneral, mostrarFolioControl);
        } catch (SQLException e) {
            Logger.getLogger(CReporteDGAIR.class.getName()).log(Level.SEVERE, null, e);
            resp = "error";
        }

        return resp;
    }

    private String generarExcel(List<ReporteDGAIR> lstFiltro, String mostrarPromedioGeneral, String mostrarFolioControl) {
        lstEncabezados = new ArrayList<>();
        lstEncabezados.add("Estatus");
        lstEncabezados.add("Año del ciclo escolar");
        lstEncabezados.add("CURP");
        lstEncabezados.add("Promedio General");
        lstEncabezados.add("Tipo de documento");
        lstEncabezados.add("Fecha Expedición del documento");
        lstEncabezados.add("Folio del documento");

        Workbook reporte = new XSSFWorkbook();
        Sheet hojaLLenado = reporte.createSheet("Hoja de Llenado");
        CellStyle cs = CReporteDGAIR.getHeaderCellStyle(reporte);
        llenarEncabezadoTitulo(hojaLLenado, cs);
        if (lstFiltro.isEmpty()) {
            return "empty";
        }
        for (int i = 0; i < lstFiltro.size(); i++) {
            ReporteDGAIR row = lstFiltro.get(i);
            Row fila = hojaLLenado.createRow(i + 1);

            XSSFCellStyle style = getBodyCellStyle(reporte, false);
            Cell cell = fila.createCell(0);
            cell.setCellValue(row.getEstatus());
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(0);

            style = getBodyCellStyle(reporte, true);
            cell = fila.createCell(1);
            cell.setCellValue(row.getAnioCicloEscolar());
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(1);

            cell = fila.createCell(2);
            cell.setCellValue(row.getCurp());
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(2);

            style = getBodyCellStyle(reporte, false);
            cell = fila.createCell(3);
            cell.setCellValue(mostrarPromedioGeneral.equalsIgnoreCase("1") ? row.getPromedioGeneral() : "");
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(3);

            cell = fila.createCell(4);
            cell.setCellValue(row.getTipoDocumento());
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(4);

            cell = fila.createCell(5);
            cell.setCellValue(row.getFechaExpedicionDocumento());
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(5);

            cell = fila.createCell(6);
            cell.setCellValue(mostrarFolioControl.equalsIgnoreCase("1") ? row.getFolioDocumento() : "");
            cell.setCellStyle(style);
            hojaLLenado.autoSizeColumn(6);

        }
        llenarNombreInstitucion();
        String fechaGen = sdf.format(new Date());
        String path = System.getProperty("user.dir") + "\\webapps\\Instituciones\\" + NombreInstitucion.trim() + "\\ArchivosInstitucionales\\REPORTE CERTIFICADOS Y TITULOS SEP FEDERAL " + fechaGen + ".xlsx";
        try (FileOutputStream doc = new FileOutputStream(path)) {
            reporte.write(doc);
        } catch (FileNotFoundException ex) {
            Logger.getLogger(CReporteDGAIR.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(CReporteDGAIR.class.getName()).log(Level.SEVERE, null, ex);
        }
        File xlsx = new File(System.getProperty("user.dir") + "\\webapps\\Instituciones\\" + NombreInstitucion.trim() + "\\ArchivosInstitucionales\\REPORTE CERTIFICADOS Y TITULOS SEP FEDERAL " + fechaGen + ".xlsx");
        if (xlsx.exists()) {
            return "../../../Instituciones/" + NombreInstitucion.trim() + "/ArchivosInstitucionales/REPORTE CERTIFICADOS Y TITULOS SEP FEDERAL " + fechaGen + ".xlsx";
        }
        return "error";
    }

    private static CellStyle getHeaderCellStyle(Workbook excel) {
        byte[] rgb = new byte[3];
        rgb[0] = (byte) 198; // red
        rgb[1] = (byte) 239; // green
        rgb[2] = (byte) 206; // blue
        XSSFColor myColor = new XSSFColor(rgb); // #C6EFCE

        XSSFCellStyle cs = (XSSFCellStyle) excel.createCellStyle();
        cs.setAlignment(CellStyle.ALIGN_CENTER);
        cs.setVerticalAlignment(VerticalAlignment.CENTER);
        cs.setFillForegroundColor(myColor);
        cs.setFillPattern(CellStyle.SOLID_FOREGROUND);
        cs.setBorderTop(CellStyle.BORDER_THIN);
        cs.setTopBorderColor(IndexedColors.BLACK.getIndex());
        cs.setBorderLeft(CellStyle.BORDER_THIN);
        cs.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        cs.setBorderRight(CellStyle.BORDER_THIN);
        cs.setRightBorderColor(IndexedColors.BLACK.getIndex());
        cs.setBorderBottom(CellStyle.BORDER_THIN);
        cs.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        cs.setFont(getFont(excel));
        return cs;
    }

    private static XSSFCellStyle getBodyCellStyle(Workbook excel, boolean alignCenter) {

        XSSFCellStyle style = (XSSFCellStyle) excel.createCellStyle();
        if (alignCenter) {
            style.setAlignment(CellStyle.ALIGN_CENTER);
        }
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.getIndex());
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        return style;
    }

    private void llenarEncabezadoTitulo(Sheet sheet, CellStyle cs) {
        Row encabezados = sheet.createRow(0);
        encabezados.setHeightInPoints((float) 19.5);
        for (int a = 0; a < lstEncabezados.size(); a++) {
            Cell celda = encabezados.createCell(a);
            celda.setCellValue(lstEncabezados.get(a));
            celda.setCellStyle(cs);
            sheet.autoSizeColumn(a);
        }
    }

    public void llenarNombreInstitucion() {
        try {
            String Query = "SELECT nombreInstitucion FROM Configuracion_Inicial AS CI "
                    + " JOIN Usuario AS U ON U.Id_ConfiguracionInicial = CI.ID_ConfiguracionInicial "
                    + " WHERE Id_Usuario = " + Id_Usuario;
            PreparedStatement pstmt = con.prepareStatement(Query);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                NombreInstitucion = rs.getString(1);
            }
        } catch (SQLException ex) {
            Logger.getLogger(CTitulos.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static Font getFont(Workbook excel) {
        //configuramos la fuente
        Font font = excel.createFont();
        font.setBold(true);
        font.setBoldweight(Font.BOLDWEIGHT_NORMAL);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.GREEN.getIndex());
        return font;
    }
}
