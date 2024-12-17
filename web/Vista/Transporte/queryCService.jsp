<%-- 
    Document   : queryCService
    Created on : 03-nov-2021, 9:21:54
    Author     : BSorcia
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<jsp:useBean id="CService" class="com.ginndex.digisep.api.HandlerService" scope="session"/>
<%
    request.setCharacterEncoding("UTF-8");
    CService.setRequest(request);
    out.print(CService.accionesHandlerService());
%>