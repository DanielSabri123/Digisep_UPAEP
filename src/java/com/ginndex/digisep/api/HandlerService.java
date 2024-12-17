package com.ginndex.digisep.api;

import com.ginndex.titulos.control.CBitacora;
import com.ginndex.titulos.control.CConexion;
import com.ginndex.titulos.modelo.Alumno;
import com.ginndex.titulos.modelo.Bitacora;
import com.ginndex.titulos.modelo.Calificacion;
import com.ginndex.titulos.modelo.Carrera;
import com.ginndex.titulos.modelo.Curso;
import com.ginndex.titulos.modelo.Materia;
import com.ginndex.titulos.modelo.TETitulosCarreras;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 *
 * @author BSorcia
 */
public class HandlerService {

    private UPAEPService servicio;
    private Carrera carrera;
    private TETitulosCarreras teCarreras;
    private JsonArray respuestServicio;
    private HttpServletRequest request;
    private String resp;
    private String bandera;
    private String sql;
    private CConexion conexion;
    private PreparedStatement pstmt;
    private CallableStatement cstmt;
    private Connection con;
    List<Curso> lstCursoCarrera;
    private Curso curso;
    private Materia materia;
    private Alumno alumno;
    private Calificacion calificacion;
    private String idUsuario;

    public HttpServletRequest getRequest() {
        return request;
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public String accionesHandlerService() throws ParseException, IOException, SQLException {
        long startTime = System.currentTimeMillis();
        HttpSession sessionOk = request.getSession();
        bandera = request.getParameter("txtBandera");

        servicio = new UPAEPService();
        servicio.setRequest(request);
        //Iniciamos sesión en el servicio
        //Esta validado el no generar tokens, sino reservar el actual hasta su muerte
        //o el cierre de sesión.
        servicio.doPostLogIn();
        conexion = CConexion.getInstance();
        conexion.setRequest(request);
        con = CConexion.getInstanceC();
        idUsuario = sessionOk.getAttribute("Id_Usuario").toString();
        resp = "";
        switch (bandera) {
            case "1":
                resp = descargarCarreras();
                break;
            case "2":
                resp = descargarAsignaturas();
                break;
            case "3":
                resp = descargarAlumnos();
                break;
            case "4":
                resp = descargarCalificaciones();
                break;
            default:
                resp = "";
                break;
        }
        long endTime = System.currentTimeMillis() - startTime;
        System.out.println("RETORNO " + resp);
        return resp;
    }

    private String descargarCarreras() {
        String metodoRespuesta = "";
        JsonObject jsonCarrera;
        List<String> lstCurso = new ArrayList<>();
        try {
            respuestServicio = servicio.doPostCarreras();
            if (respuestServicio == null) {
                metodoRespuesta = "error¬" + servicio.getRespuestaConsumo().toString();
            } else {
                for (JsonElement elemento : respuestServicio) {
                    jsonCarrera = elemento.getAsJsonObject();
                    carrera = new Carrera();
                    teCarreras = new TETitulosCarreras();

                    carrera.setId_Carrera_Excel(jsonCarrera.get("IDCARRERA").getAsString());
                    carrera.setDescripcion(jsonCarrera.get("NOMBRECARRERA").getAsString());
                    carrera.setClave(jsonCarrera.get("CVECARRERA").getAsString());
                    carrera.setCvePlanCarrera(jsonCarrera.get("CVEPLANCARRERA").getAsString());
                    carrera.setTotalCreditos(jsonCarrera.get("NUMTOTALCREDITOS").getAsString());
                    carrera.setTotalMaterias(jsonCarrera.get("NUMTOTALMATERIAS").getAsString());
                    carrera.setCalificacionMinima(jsonCarrera.get("CALMINIMA").getAsString());
                    carrera.setCalificacionMaxima(jsonCarrera.get("CALMAXIMA").getAsString());
                    carrera.setCalificacionMinimaAprobatoria(jsonCarrera.get("CALAPROBATORIA").getAsString());

                    teCarreras.setClaveInstitucion(jsonCarrera.get("CVEINSTITUCION").getAsString());
                    teCarreras.setNombreInstitucion(jsonCarrera.get("NOMBREINSTITUCION").getAsString());
                    teCarreras.setClaveCampus(jsonCarrera.get("CVECAMPUS").getAsString());
                    teCarreras.setCampus(jsonCarrera.get("NOMBRECAMPUS").getAsString());
                    teCarreras.setID_TipoPeriodo(jsonCarrera.get("TIPOPERIODO").getAsString());
                    teCarreras.setID_AutorizacionReconocimiento(jsonCarrera.get("AUTORIZARECONOCIMIENTO").getAsString());
                    teCarreras.setID_Nivel(jsonCarrera.get("NIVELEDUCATIVO").getAsString());
                    teCarreras.setID_Entidad(jsonCarrera.get("ENTIDADFEDERATIVA").getAsString());
                    teCarreras.setNumeroRvoe(jsonCarrera.get("RVOE").getAsString());
                    teCarreras.setFechaExpedicionRvoe(jsonCarrera.get("FECHAEXPRVOE").getAsString());

                    sql = "{call Add_Carrera_Excel (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
                    cstmt = con.prepareCall(sql);

                    cstmt.setString(1, carrera.getId_Carrera_Excel());
                    cstmt.setString(2, carrera.getClave());
                    cstmt.setString(3, carrera.getDescripcion());
                    cstmt.setString(4, teCarreras.getClaveInstitucion());
                    cstmt.setString(5, teCarreras.getNombreInstitucion());
                    cstmt.setString(6, teCarreras.getClaveCampus());
                    cstmt.setString(7, teCarreras.getCampus());
                    cstmt.setString(8, teCarreras.getID_AutorizacionReconocimiento());
                    cstmt.setString(9, teCarreras.getNumeroRvoe());
                    cstmt.setString(10, teCarreras.getID_TipoPeriodo());
                    cstmt.setString(11, teCarreras.getID_Nivel());
                    cstmt.setString(12, carrera.getTotalMaterias());
                    cstmt.setString(13, teCarreras.getID_Entidad());
                    cstmt.setString(14, teCarreras.getFechaExpedicionRvoe());
                    cstmt.setString(15, carrera.getCalificacionMinima());
                    cstmt.setString(16, carrera.getCalificacionMaxima());
                    cstmt.setString(17, carrera.getCalificacionMinimaAprobatoria());
                    cstmt.setString(18, carrera.getCvePlanCarrera());
                    cstmt.setString(19, carrera.getTotalCreditos());
                    cstmt.registerOutParameter(20, java.sql.Types.VARCHAR);
                    cstmt.execute();
                    String idCurso = null;
                    if ((cstmt.getUpdateCount() == -1) && (cstmt.getResultSet() == null)) {
                        idCurso = cstmt.getString(20);
                        if (!lstCurso.contains(idCurso)) {
                            lstCurso.add(idCurso);
                        }
                        insertarBitacora("Claves de Carrera", "Inserción/Actualización",
                                "Registro/Actualización de carreras vía WEB SERVICE||" + carrera.getId_Carrera_Excel()
                                + "¬" + carrera.getClave() + "¬" + carrera.getDescripcion() + "¬" + teCarreras.getClaveInstitucion()
                                + "¬" + teCarreras.getNombreInstitucion() + "¬" + teCarreras.getClaveCampus() + "¬" + teCarreras.getCampus()
                                + "¬" + teCarreras.getID_AutorizacionReconocimiento() + "¬" + teCarreras.getNumeroRvoe()
                                + "¬" + teCarreras.getID_TipoPeriodo() + "¬" + teCarreras.getID_Nivel() + "¬" + carrera.getTotalMaterias()
                                + "¬" + teCarreras.getID_Entidad() + "¬" + teCarreras.getFechaExpedicionRvoe()
                                + "¬" + carrera.getCalificacionMinima() + "¬" + carrera.getCalificacionMaxima() + "¬" + carrera.getCalificacionMinimaAprobatoria()
                                + "¬" + carrera.getCvePlanCarrera() + "¬" + carrera.getTotalCreditos());
                    }
                }
                metodoRespuesta = "success¬" + lstCurso.size();

            }
        } catch (IOException | NoSuchPaddingException | InvalidKeyException
                | IllegalBlockSizeException | InvalidAlgorithmParameterException
                | BadPaddingException | InvalidKeySpecException
                | NoSuchAlgorithmException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
            return "fatal";
        } catch (SQLException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
            return "fatal";
        } catch (NullPointerException ex) {
            return "empty";
        }
        return metodoRespuesta;
    }

    private String descargarAsignaturas() {
        String mensajeNulo = "";
        boolean nulo = false;
        String metodoRespuesta = "";
        String idCarrera = request.getParameter("value");
        idCarrera = (idCarrera.equals("todos") ? null : idCarrera);
        JsonObject jsonAsignatura;
        consultarCursoCarrera(idCarrera);
        List<String> lstClaveCarrera = new ArrayList<>();
        try {
            respuestServicio = servicio.doPostAsignaturas(idCarrera);
            if (respuestServicio == null) {
                metodoRespuesta = "error¬" + servicio.getRespuestaConsumo().toString();
            } else {
                for (JsonElement elemento : respuestServicio) {
                    jsonAsignatura = elemento.getAsJsonObject();
                    materia = new Materia();
                    
                    //Si en dado caso hay valores nulos el sistema informara que hay valores nulos
                    if (jsonAsignatura.get("FOLIOORDENAMIENTO").getAsString() == null) {
                        return mensajeNulos("Folios Ordenamiento");
                    }
                    if (jsonAsignatura.get("CLVASIGNATURA").getAsString() == null) {
                        return mensajeNulos("Clave de Asignatura");
                    }
                    if (jsonAsignatura.get("DESCRIPCION").getAsString() == null) {
                        return mensajeNulos("Descripción");
                    }
                    if (jsonAsignatura.get("TIPOASIGNATURA").getAsString() == null) {
                        return mensajeNulos("Tipo de Asignatura");
                    }
                    materia.setFolio(jsonAsignatura.get("FOLIOORDENAMIENTO").getAsString());
                    materia.setClave(jsonAsignatura.get("CLVASIGNATURA").getAsString());
                    materia.setDescripcion(jsonAsignatura.get("DESCRIPCION").getAsString());

                    if (jsonAsignatura.get("NUMCREDITOS") == null) {
                        nulo = true;
                        mensajeNulo = "Al parecer se encontraron numero de creditos nulos o sin valor, en su lugar se ha puesto un '0' como valor, revisa la información.¬";
                    }
                    materia.setCreditos((jsonAsignatura.get("NUMCREDITOS") == null ? "0" : jsonAsignatura.get("NUMCREDITOS").getAsString()));
                    //materia.setCreditos(jsonAsignatura.get("NUMCREDITOS").getAsString());
                    materia.setTipo(jsonAsignatura.get("TIPOASIGNATURA").getAsString());

                    switch (materia.getTipo()) {
                        case "OBLIGATORIA":
                            materia.setTipo("263");
                            break;
                        case "OPTATIVA":
                            materia.setTipo("264");
                            break;
                        case "ADICIONAL":
                            materia.setTipo("265");
                            break;
                        case "COMPLEMENTARIA":
                            materia.setTipo("266");
                            break;
                        case "":
                            materia.setTipo("263");//Si se deja en blanco la llenamos como obligatoria
                            break;
                        default:
                            materia.setTipo("263");//Si se deja en blanco la llenamos como obligatoria
                            break;
                    }
                    String aux = "";
                    try {
                        final String streamC = jsonAsignatura.get("IDCARRERA").getAsString();
                        aux = streamC;
                        if (streamC == null || streamC.equalsIgnoreCase("null")) {
                            return "jsonCarrera";
                        }
                        Curso c = lstCursoCarrera.stream().filter(streamCurso -> streamC.equals(streamCurso.getID_Carrera())).findAny().orElse(null);
                        materia.setID_Curso(c.getID_Curso());
                    } catch (NullPointerException ex) {
                        return "noCarrera¬<p>El sistema no encuentra el identificador de carrera <b>" + aux + "</b> para la asignatura con clave: " + materia.getClave() + " enviado en el web service, interrumpiendo la descarga de la información."
                                + "<br><strong><small>Verifica que la carrera esté registrada en el sistema.</small></strong>";
                    }

                    sql = "{call Add_Materia_Excel (?,?,?,?,?,?)}";
                    cstmt = con.prepareCall(sql);

                    cstmt.setString(1, materia.getID_Curso());
                    cstmt.setString(2, materia.getFolio());
                    cstmt.setString(3, materia.getClave());
                    cstmt.setString(4, materia.getDescripcion());
                    cstmt.setString(5, materia.getCreditos());
                    cstmt.setString(6, materia.getTipo());
                    cstmt.execute();
                    if (!lstClaveCarrera.contains(materia.getClave() + "_" + materia.getID_Curso())) {
                        lstClaveCarrera.add(materia.getClave() + "_" + materia.getID_Curso());
                    }
                }

                if (nulo) {
                    metodoRespuesta = "null¬" + mensajeNulo + lstClaveCarrera.size();
                } else {
                    metodoRespuesta = "success¬" + lstClaveCarrera.size();
                    insertarBitacora("Carga Carreras", "Inserción/Actualización",
                            "Registro/Actualización de asiganturas vía WEB SERVICE||Id Carrera: " + (idCarrera == null ? "TODAS" : idCarrera) + "¬Total de asignaturas: " + lstClaveCarrera.size());
                }
            }
        } catch (IOException | NoSuchPaddingException | InvalidKeyException
                | IllegalBlockSizeException | InvalidAlgorithmParameterException
                | BadPaddingException | InvalidKeySpecException
                | NoSuchAlgorithmException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
            return "fatal";
        } catch (SQLException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
            return "fatal";
        }

        return metodoRespuesta;
    }

    private String descargarAlumnos() {
        String metodoRespuesta = "";
        String idAlumno = "";
        ResultSet rs;
        String plainResp = request.getParameter("value");
        JsonArray array = new JsonParser().parse(plainResp).getAsJsonArray();
        int contador = 0;
        try {
            for (JsonElement e : array) {
                JsonObject dato = e.getAsJsonObject();
                respuestServicio = servicio.doPostAlumnos(dato.get("id").getAsString(), dato.get("mat").getAsString());
                if (respuestServicio == null) {
                    return "error¬0¬" + servicio.getRespuestaConsumo().toString();
                } else {
                    if (respuestServicio.size() == 0) {
                        return "error¬1¬"
                                + "<p>Alumno no encontrado <b>Matrícula: " + dato.get("mat").getAsString() + "</b>.</p><br>"
                                + "<small>El servicio no arroja resultados</small>"
                                + "<br><small>Los registros posteriores no fueron insertados.</small>"
                                + "<br><small>Verifica la información. Si el problema persiste contacta a soporte técnico para obtener más información.</small>¬"
                                + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                    }
                    JsonElement element = respuestServicio.get(0);
                    JsonObject jsonAlumno = element.getAsJsonObject();

                    alumno = new Alumno();
                    String currField = "";
                    try {
                        currField = "Nombre";
                        alumno.getPersona().setNombre(jsonAlumno.get("NOMBREALUMNO").getAsString());
                        currField = "Apellido Paterno";
                        alumno.getPersona().setAPaterno(jsonAlumno.get("APPATERNO").getAsString());
                        currField = "Apellido Materno";
                        alumno.getPersona().setAMaterno(jsonAlumno.get("APMATERNO").getAsString());
                        currField = "CURP";
                        String curp = jsonAlumno.get("CURP").getAsString();
                        alumno.getPersona().setCurp(curp);
                        currField = "Fecha Nacimiento";
                        alumno.getPersona().setFechaNacimiento(jsonAlumno.get("FECHANACIMIENTO").getAsString());
                        currField = "Sexo";
                        alumno.getPersona().setSexo(jsonAlumno.get("SEXO").getAsString());
                        currField = "Correo";
                        alumno.getPersona().setEmail(jsonAlumno.get("CORREO").getAsString());
                        currField = "MATRICULA";
                        alumno.setMatricula(jsonAlumno.get("MATRICULA").getAsString());
                        currField = "Identificador de la carrera";
                        alumno.setID_Carrera(jsonAlumno.get("IDCARRERA").getAsString());
                        currField = "Fecha de inicio de la carrera";
                        alumno.setFechaInicioCarrera(jsonAlumno.get("FECHAINICIOCARRERA").getAsString());
                        currField = "Fecha de fin de la carrera";
                        alumno.setFechaFinCarrera(jsonAlumno.get("FECHAFINCARRERA").getAsString());
                        currField = "Generación";
                        alumno.getGeneracion().setGeneracion(jsonAlumno.get("GENERACION").getAsString());
                        currField = "Fecha Inicio Antecedente";
                        alumno.setFechaInicioAnt(jsonAlumno.get("FECHINICIOANT").getAsString());
                        currField = "Fecha Fin Antecedente";
                        alumno.setFechaFinAnt(jsonAlumno.get("FECHFINANT").getAsString());
                        currField = "Tipo Antecedente";
                        alumno.setTipoAnt(jsonAlumno.get("TIPOANT").getAsString());
                        currField = "País Antecedente";
                        alumno.setPaisAnt( ( curp.equalsIgnoreCase("Extranjero") || curp.equalsIgnoreCase("Extranjera") ) && jsonAlumno.has("PAISANT") ? jsonAlumno.get("PAISANT").getAsString() : "");
                        currField = "Estado Antecedente";
                        alumno.setEstadoAnt( ( curp.equalsIgnoreCase("Extranjero") || curp.equalsIgnoreCase("Extranjera") ) && jsonAlumno.has("ESTADOANT") ? jsonAlumno.get("ESTADOANT").getAsString() : "");
                        
                    } catch (NullPointerException ex) {
                        return "error¬1¬"
                                + "<p>Alumno con  información incompleta en el campo: <b>" + currField + "</b>. <b>Matrícula: <i>" + dato.get("mat").getAsString() + "</i></b>.</p>"
                                + "<small>Los registros posteriores no fueron insertados.</small>"
                                + "<br><small>Verifica la información. Si el problema persiste contacte a su área de sistemas.</small>¬"
                                + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                    }

                    sql = "{call Add_Alumno_Excel(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
                    cstmt = con.prepareCall(sql);
                    cstmt.setString(1, alumno.getMatricula());
                    cstmt.setString(2, alumno.getPersona().getNombre());
                    cstmt.setString(3, alumno.getPersona().getAPaterno());
                    cstmt.setString(4, alumno.getPersona().getAMaterno());
                    cstmt.setString(5, alumno.getPersona().getCurp());
                    cstmt.setString(6, alumno.getGeneracion().getGeneracion());
                    cstmt.setString(7, alumno.getID_Carrera());
                    cstmt.setString(8, alumno.getPersona().getSexo());
                    cstmt.setString(9, alumno.getFechaInicioCarrera());
                    cstmt.setString(10, alumno.getFechaFinCarrera());
                    cstmt.setString(11, alumno.getPersona().getFechaNacimiento());
                    cstmt.setString(12, alumno.getPersona().getEmail());

                    cstmt.setString(13, alumno.getFechaInicioAnt());
                    cstmt.setString(14, alumno.getFechaFinAnt());
                    cstmt.setString(15, alumno.getTipoAnt());
                    cstmt.setString(16, alumno.getPaisAnt());
                    cstmt.setString(17, alumno.getEstadoAnt());

                    cstmt.registerOutParameter(18, java.sql.Types.VARCHAR);

                    cstmt.execute();

                    if ((cstmt.getUpdateCount() != -1) && (cstmt.getResultSet() != null)) {
                        rs = cstmt.getResultSet();
                        rs.next();
                        Logger.getLogger(HandlerService.class.getName()).log(Level.INFO, "Error Message: ------->{0}", rs.getString("ErrorMessage"));
                        return "error¬1¬"
                                + "<p>Error al insertar al alumno con la matrícula: <b>" + alumno.getMatricula() + "</b>.</p><br>"
                                + "<small>El servidor devolvió el siguiente mensaje de error desde SQL: <b>" + rs.getString("ErrorMessage") + "</b></small>"
                                + "<br><small>Los registros posteriores no fueron insertados.</small>"
                                + "<br><small>Contacta a soporte técnico para obtener más información.</small>¬"
                                + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                    } else {
                        idAlumno = cstmt.getString(18);
                        if (idAlumno.equalsIgnoreCase("sinCarrera")) {
                            metodoRespuesta = "sinCarrera";
                            return metodoRespuesta + "¬"
                                    + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString()
                                    + "¬" + alumno.getPersona().getNombre() + " " + alumno.getPersona().getAPaterno() + " " + alumno.getPersona().getAMaterno()
                                    + "¬" + alumno.getMatricula() + "¬" + alumno.getID_Carrera();
                        } else if (idAlumno.equalsIgnoreCase("certificadoActivo")) {
                            metodoRespuesta = "certificadoActivo";
                            return metodoRespuesta + "¬"
                                    + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString()
                                    + "¬" + alumno.getPersona().getNombre() + " " + alumno.getPersona().getAPaterno() + " " + alumno.getPersona().getAMaterno()
                                    + "¬" + alumno.getMatricula();
                        } else if (idAlumno.equalsIgnoreCase("tituloActivo")) {
                            metodoRespuesta = "tituloActivo";
                            return metodoRespuesta + "¬"
                                    + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString()
                                    + "¬" + alumno.getPersona().getNombre() + " " + alumno.getPersona().getAPaterno() + " " + alumno.getPersona().getAMaterno()
                                    + "¬" + alumno.getMatricula();
                        } else {
                            if (idAlumno.equalsIgnoreCase("success")) {
                                contador++;
                            }
                            insertarBitacora("Alumnos", "Inserción/Actualización", "Registro/Actualización de alumnos vía WEB SERVICE||"
                                    + alumno.getMatricula() + "¬" + alumno.getPersona().getNombre() + "¬" + alumno.getPersona().getAPaterno()
                                    + "¬" + alumno.getPersona().getAMaterno() + "¬" + alumno.getPersona().getCurp()
                                    + "¬" + alumno.getGeneracion().getGeneracion()
                                    + "¬" + alumno.getID_Carrera() + "¬" + alumno.getPersona().getSexo()
                                    + "¬" + alumno.getFechaInicioCarrera() + "¬" + alumno.getFechaFinCarrera()
                                    + "¬" + alumno.getPersona().getFechaNacimiento() + "¬" + alumno.getPersona().getEmail());
                        }
                    }
                }
            }

        } catch (IOException | NoSuchAlgorithmException | NoSuchPaddingException
                | InvalidKeyException | IllegalBlockSizeException
                | InvalidAlgorithmParameterException | BadPaddingException
                | InvalidKeySpecException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
            return "fatal";
        }
        return "success¬" + contador;
    }

    private String descargarCalificaciones() {
        String metodoRespuesta = "";
        String idAlumno = "";
        ResultSet rs;
        String plainResp = request.getParameter("value");
        JsonArray array = new JsonParser().parse(plainResp).getAsJsonArray();
        int contador = 0;
        try {
            for (JsonElement e : array) {
                JsonObject dato = e.getAsJsonObject();
                respuestServicio = servicio.doPostCalificaciones(dato.get("id").getAsString(), dato.get("mat").getAsString());
                if (respuestServicio == null) {
                    return "error¬0¬" + servicio.getRespuestaConsumo().toString() + "¬"
                            + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                } else {
                    if (respuestServicio.size() == 0) {
                        return "error¬1¬"
                                + "<p>Calificaciones no encontradas <br><b>Matrícula: " + dato.get("mat").getAsString() + "</b>.</p>"
                                + "<small>El servicio no arroja resultados</small>"
                                + "<br><small>Los registros posteriores no fueron insertados.</small>"
                                + "<br><small>Verifica la información. Si el problema persiste contacta a soporte técnico para obtener más información.</small>¬"
                                + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                    }
                    int cont = 0;
                    for (JsonElement element : respuestServicio) {
                        JsonObject jsonCalificaciones = element.getAsJsonObject();
                        System.out.println("contador " + cont++);
                        calificacion = new Calificacion();
                        alumno = new Alumno();
                        try {
                            calificacion.getMateria().setClave(jsonCalificaciones.get("CVEMATERIA").getAsString());
                            calificacion.setObservaciones(jsonCalificaciones.get("IDOBSERVACION").getAsString());
                            alumno.setMatricula(jsonCalificaciones.get("MATRICULA").getAsString());
                            calificacion.setID_Ciclo(jsonCalificaciones.get("CICLOESCOLAR").getAsString());
                            alumno.setID_Carrera(jsonCalificaciones.get("IDCARRERA").getAsString());
                            calificacion.setCalificacion(jsonCalificaciones.get("CALIFICACION").getAsString());
                            calificacion.getMateria().setFolio(jsonCalificaciones.get("FORDENAMIENTO").getAsString());

                            switch (calificacion.getObservaciones()) {
                                case "EQUIVALENCIA DE ESTUDIOS":
                                    calificacion.setObservaciones("70");
                                    break;
                                case "EXAMEN EXTRAORDINARIO":
                                    calificacion.setObservaciones("71");
                                    break;
                                case "EXAMEN A TITULO DE SUFICIENCIA":
                                    calificacion.setObservaciones("72");
                                    break;
                                case "CURSO DE VERANO":
                                    calificacion.setObservaciones("73");
                                    break;
                                case "RECURSAMIENTO":
                                    calificacion.setObservaciones("74");
                                    break;
                                case "REINGRESO":
                                    calificacion.setObservaciones("75");
                                    break;
                                case "ACUERDO REGULARIZACIÓN":
                                    calificacion.setObservaciones("76");
                                    break;
                                case "CON CAMBIO EN EL ACUERDO DE RVOE":
                                    calificacion.setObservaciones("77");
                                    break;
                                case "REVALIDACIÓN DE ESTUDIOS":
                                    calificacion.setObservaciones("78");
                                    break;
                                case "CURSO DE REGULARIZACIÓN":
                                    calificacion.setObservaciones("104");
                                    break;
                                case "CORRESPONDENCIA DE ASIGNATURA POR PLAN":
                                    calificacion.setObservaciones("101");
                                    break;
                                case "EXENTO":
                                    calificacion.setObservaciones("102");
                                    break;
                                case "NORMAL / ORDINARIO":
                                    calificacion.setObservaciones("100");
                                    break;
                                case "NORMAL":
                                    calificacion.setObservaciones("100");
                                    break;
                                case "ORDINARIO":
                                    calificacion.setObservaciones("100");
                                    break;
                                case "INTERCAMBIO ACADÉMICO":
                                    calificacion.setObservaciones("105");
                                    break;
                                default:
                                    System.out.println("ENTRO AL DEFAULT");
                                    break;
                            }
                            
                        } catch (NullPointerException ex) {
                            return "error¬1¬"
                                    + "<p>Alumno con  información incompleta <b>Matrícula: <i>" + dato.get("mat").getAsString() + "</i></b>.</p>"
                                    + "<small>Los registros posteriores no fueron insertados.</small>"
                                    + "<br><small>Verifica la información. Si el problema persiste contacte a su área de sistemas.</small>¬"
                                    + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                        }
                        sql = "{call Add_Calificacion (?,?,?,?,?,?,?,?)}";
                        cstmt = con.prepareCall(sql);
                        cstmt.setString(1, alumno.getMatricula());
                        cstmt.setString(2, alumno.getID_Carrera());
                        cstmt.setString(3, calificacion.getMateria().getClave());
                        cstmt.setString(4, calificacion.getMateria().getFolio());
                        cstmt.setString(5, calificacion.getCalificacion());
                        cstmt.setString(6, calificacion.getID_Ciclo());
                        cstmt.setString(7, calificacion.getObservaciones());
                        cstmt.registerOutParameter(8, java.sql.Types.VARCHAR);

                        cstmt.execute();

                        if ((cstmt.getUpdateCount() != -1) && (cstmt.getResultSet() != null)) {
                            rs = cstmt.getResultSet();
                            rs.next();
                            Logger.getLogger(HandlerService.class.getName()).log(Level.INFO, "Error Message: ------->{0}", rs.getString("ErrorMessage"));
                            return "error¬1¬"
                                    + "<p>Error al insertar al alumno con la matrícula: <b>" + alumno.getMatricula() + "</b>.</p><br>"
                                    + "<small>El servidor devolvió el siguiente mensaje de error desde SQL: <b>" + rs.getString("ErrorMessage") + "</b></small>"
                                    + "<br><small>Los registros posteriores no fueron insertados.</small>"
                                    + "<br><small>Contacta a soporte técnico para obtener más información.</small>¬"
                                    + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString();
                        } else {
                            idAlumno = cstmt.getString(8);
                            if (idAlumno.equalsIgnoreCase("sinCarrera")) {
                                metodoRespuesta = "sinCarrera";
                                return metodoRespuesta + "¬"
                                        + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString() + "¬" + alumno.getMatricula();
                            } else if (idAlumno.contains("sinAlumno")) {
                                metodoRespuesta = "sinAlumno";
                                return metodoRespuesta + "¬"
                                        + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString() + "¬" + alumno.getMatricula();
                            } else if (idAlumno.contains("sinMateria")) {
                                metodoRespuesta = "sinMateria";
                                return metodoRespuesta + "¬"
                                        + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString() + "¬" + calificacion.getMateria().getClave();
                            } else if (idAlumno.contains("certificadoActivo")) {
                                metodoRespuesta = "certificadoActivo";
                                return metodoRespuesta + "¬"
                                        + dato.get("id").getAsString() + "_" + dato.get("mat").getAsString() + "¬" + alumno.getMatricula();
                            } else {
                                if (idAlumno.equalsIgnoreCase("success")) {
                                    contador++;
                                }
                            }
                        }
                    }
                }
            }

        } catch (IOException | NoSuchAlgorithmException | NoSuchPaddingException
                | InvalidKeyException | IllegalBlockSizeException
                | InvalidAlgorithmParameterException | BadPaddingException
                | InvalidKeySpecException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
            return "fatal";
        }

        return "success¬" + contador;
    }

    private void consultarCursoCarrera(String idCarrera) {
        lstCursoCarrera = new ArrayList<>();
        ResultSet rs;
        try {

            String sqlCurso = "SELECT Id_Carrera_Excel,Id_Curso \n"
                    + "FROM Carrera c JOIN Curso cu ON c.ID_Carrera = cu.ID_Carrera";
            sqlCurso += (idCarrera == null ? "" : " WHERE Id_Carrera_Excel = ?");
            pstmt = con.prepareStatement(sqlCurso);
            if (idCarrera != null) {
                pstmt.setString(1, idCarrera);
            }
            rs = pstmt.executeQuery();
            while (rs.next()) {
                curso = new Curso();
                curso.setID_Carrera(rs.getString("Id_Carrera_Excel"));
                curso.setID_Curso(rs.getString("Id_Curso"));
                lstCursoCarrera.add(curso);
            }
        } catch (SQLException ex) {
            lstCursoCarrera = null;
        }
    }

    private String mensajeNulos(String tipo) {
        String mensaje = "";
        mensaje = "nulos¬Al parecer se encontraron " + tipo + " nulos o sin valor, revisa la información.";
        return mensaje;
    }

    private void insertarBitacora(String modulo, String movimiento, String informacion) {
        Bitacora bitacora = new Bitacora();
        bitacora.setId_Usuario(idUsuario);
        bitacora.setModulo(modulo);
        bitacora.setMovimiento(movimiento);
        bitacora.setInformacion(informacion);
        CBitacora cBitacora = new CBitacora(bitacora);
        cBitacora.setRequest(request);
        try {
            cBitacora.addBitacoraGeneral();
        } catch (SQLException ex) {
            Logger.getLogger(HandlerService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
