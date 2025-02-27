/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ginndex.titulos.control;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;

/**
 *
 * @author Paulina
 */
public class CConexion {

    private static CConexion instance = null;
    private static Connection connection = null;
    HttpServletRequest request;
    HttpServletResponse response;

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public HttpServletResponse getResponse() {
        return response;
    }

    public void setResponse(HttpServletResponse response) {
        this.response = response;
    }

    public static void setInstance() {
        instance = null;
    }

    public static void setInstanceC() throws SQLException {
        if (connection != null) {
            if (!connection.isClosed()) {
                connection.close();
                connection = null;
            }
        }
    }

    public static CConexion getInstance() {
        if (instance == null) {
            instance = new CConexion();
        }
        return instance;
    }

    public static Connection getInstanceC() throws SQLException {
        if (connection == null || connection.isClosed()) {
            if (connection != null && connection.isClosed()) {
                System.out.println("Connection is Closed!!");
            }
            connection = getInstance().GetconexionInSite();
        }
        return connection;
    }

    public Connection GetconexionInSite() throws SQLException {
        BufferedReader br = null;
        Connection conexion = null;
        try {
            String carpeta = "";
            if (request != null) {
                carpeta = request.getParameter("txtCarpeta") + "";
                if (carpeta.equalsIgnoreCase("") || carpeta.equalsIgnoreCase("null")) {
                    carpeta = getRequest().getSession().getAttribute("txtCarpeta") + "";
                }
                //System.out.println(carpeta);
            }
            File fileConexion = new File(System.getProperty("user.dir") + "\\webapps\\" + carpeta + "\\Conexion.txt");
            //System.out.println(fileConexion.getAbsolutePath());
            br = new BufferedReader(new FileReader(fileConexion));
            String st;
            String[] datosConexion = new String[3];
            int i = 0;
            while ((st = br.readLine()) != null) {
                datosConexion[i] = st.split("\t")[1];
                ++i;
            }
            br.close();
            PoolProperties p = new PoolProperties();

            p.setUrl(datosConexion[0]);

            if (request != null) {
                carpeta = request.getParameter("txtCarpeta") + "";
                if (carpeta.equalsIgnoreCase("") || carpeta.equalsIgnoreCase("null")) {
                    getRequest().getSession().setAttribute("bdName", datosConexion[0].split(":")[4].split("/")[1].split(";")[0]);
                }
                //System.out.println(carpeta);
            }

            p.setDriverClassName("net.sourceforge.jtds.jdbc.Driver");
            p.setUsername(datosConexion[1]);
            p.setPassword(datosConexion[2]);
            p.setJmxEnabled(true);
            p.setTestWhileIdle(false);
            p.setTestOnBorrow(true);
            p.setValidationQuery("SELECT 1");
            p.setTestOnReturn(false);
            p.setValidationInterval(30000);
            p.setTimeBetweenEvictionRunsMillis(30000);
            p.setMaxActive(10000);
            p.setInitialSize(1);
            p.setMaxWait(10000);
            p.setRemoveAbandonedTimeout(60);
            p.setMinEvictableIdleTimeMillis(30000);
            p.setMaxIdle(1000);
            p.setMinIdle(100);
            p.setLogAbandoned(false);
            p.setRemoveAbandoned(true);
            p.setJdbcInterceptors("org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;" + "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer;" + "org.apache.tomcat.jdbc.pool.interceptor.ResetAbandonedTimer");
            DataSource datasource = new DataSource();
            datasource.setPoolProperties(p);
            try {
                conexion = datasource.getConnection();

            } catch (Exception e) {
                System.err.println(e.getMessage());
            }
        } catch (FileNotFoundException ex) {
            Logger.getLogger(CConexion.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(CConexion.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                br.close();
            } catch (IOException ex) {
                Logger.getLogger(CConexion.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return conexion;
    }

}
