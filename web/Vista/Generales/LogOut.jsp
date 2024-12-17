<%@page import="com.ginndex.titulos.control.CConexion"%>
<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%
    session.removeAttribute("NombreUsuario");
    session.removeAttribute("NombreTipo");
    session.invalidate();
    CConexion.setInstanceC();
    CConexion.setInstance();
    response.sendRedirect("LogIn.jsp");
%>
<%-- 
    Document   : LogOut
    Created on : 11-ene-2019, 13:06:45
    Author     : Célula de desarrollo
--%>


