/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ginndex.digisep.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

/**
 *
 * @author BSorcia
 */
public class UPAEPService {

    private static final String URL_SERVICE = "https://academicoback1.upaep.mx/SW";
    //private static final String URL_SERVICE = "https://academicobackqa.upaep.mx/SW";
    private static final String URL_SERVICE_LOGIN = "/loginalternative/digisep";
    private static final String URL_SERVICE_CARRERA = "/digisep/carreras";
    private static final String URL_SERVICE_ASIGNATURA = "/digisep/asignaturas";
    private static final String URL_SERVICE_ALUMNO = "/digisep/alumno";
    private static final String URL_SERVICE_CALIFICACION = "/digisep/materiacalif";

    private static final String USER_NAME = "DIGISEP";
    private static final String PASSWORD = "eBaU#55A-6p*3uA2LPF_9A*wR+B*=9X_WBBub=R#ut-yaG4bNXz=4-kSjeMvXF-wjC!e_^=?5bm4!m9fTpJKTD?HXsQ9_r$c^zeC";

    private HttpServletRequest request;
    private JsonObject respuestaConsumo;
    private String jwtToken;
    private static final TimeZone CENTRO = TimeZone.getTimeZone("America/Mexico_City");

    public HttpServletRequest getRequest() {
        return request;
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public JsonObject getRespuestaConsumo() {
        return respuestaConsumo;
    }

    public void doPostLogIn() throws ParseException, IOException {
        //Armamos el post de inicio
        jwtToken = request.getSession().getAttribute("access_token") + "";
        if (jwtToken == null || jwtToken.equals("null")) {
            try {
                //Quiere decir que no hay token y procedemos a iniciar sesión
                JsonObject jsonLogIn = new JsonObject();
                jsonLogIn.addProperty("username", USER_NAME);
                jsonLogIn.addProperty("password", PASSWORD);
                jsonLogIn.addProperty("date", getDate());
                String dataEncriptada = EncrypData.encryptData(jsonLogIn.toString(), EncrypData.AES_KEY_LOGIN);
                ///////System.out.println(jsonLogIn.toString());
                System.out.println(dataEncriptada);
                //Inicializamos el objeto para consultar
                HttpPost httpPost = new HttpPost(URL_SERVICE + URL_SERVICE_LOGIN);
                httpPost.setHeader("Content-Type", "application/json");
                JsonObject cryptdata = new JsonObject();
                cryptdata.addProperty("cryptdata", dataEncriptada);
                String data = cryptdata.toString();
                StringEntity entity = new StringEntity(data, "UTF-8");
                httpPost.setEntity(entity);
                HttpClient httpClient = HttpClientBuilder.create().build();
                String responseBody;
                try (CloseableHttpResponse responseHandler = (CloseableHttpResponse) httpClient.execute(httpPost)) {
                    StatusLine statusLine = responseHandler.getStatusLine();
                    responseBody = EntityUtils.toString(responseHandler.getEntity(), StandardCharsets.UTF_8);
                    if (statusLine.getStatusCode() != 202) {
                        if(statusLine.getStatusCode()==405){
                            System.out.println("Observa el horario que regresa el metodo getDat(), debe coincidir con la zona horaria local");
                        }
                        respuestaConsumo = new JsonParser().parse(responseBody).getAsJsonObject();
                        
                    } else {
                        respuestaConsumo = new JsonObject();
                        respuestaConsumo.addProperty("statusCode", 202);
                        handleJWT(responseBody);
                        respuestaConsumo.addProperty("message", "success");
                    }
                }
            } catch (NoSuchAlgorithmException | NoSuchPaddingException
                    | InvalidKeyException | IllegalBlockSizeException
                    | InvalidAlgorithmParameterException | BadPaddingException
                    | UnsupportedEncodingException ex) {
                Logger.getLogger(UPAEPService.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            //Validamos si el token es vigente
            if (!isJWTAlive()) {
                request.getSession().removeAttribute("access_token");
                doPostLogIn();
                System.out.println("Sessión renovada");
            }
        }
    }

    public JsonArray doPostCarreras() throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, InvalidAlgorithmParameterException, BadPaddingException, InvalidKeySpecException {
        //Tomamos el token de accesso.
        jwtToken = request.getSession().getAttribute("access_token") + "";
        //jwtToken = "eyJhbGciOiJIUzUxMiJ9.eyJwZXJzY2x2IjoiNDZYU2dKcnZPbk9yclBNWDhGaHIrdz09Iiwib3JpZ2VuIjoiRElHSVNFUCIsInJvbCI6WyJESUdJU0VQIl0sInN1YiI6IkRJR0lTRVAiLCJhdWQiOiJzZWN1cmUtYXBwIiwiZXhwIjoxNjM2MDcwMjM2fQ.VVz62J752jq-AWET1I9TYNOsmS6c_vMEoxPlS59uiGWvPwSuXQfvpmGqFb2X2LzFjsByamXrbfNUsLwqy4bAtw";
        //Inicializamos el objeto para consultar
        HttpPost httpPost = new HttpPost(URL_SERVICE + URL_SERVICE_CARRERA);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization2", "Bearer " + jwtToken);

        HttpClient httpClient = HttpClientBuilder.create().build();

        String responseBody;
        try (CloseableHttpResponse responseHandler = (CloseableHttpResponse) httpClient.execute(httpPost)) {
            StatusLine statusLine = responseHandler.getStatusLine();
            responseBody = EntityUtils.toString(responseHandler.getEntity(), StandardCharsets.UTF_8);
            if (statusLine.getStatusCode() != 200 || responseBody.contains("Session has expired")) {
                respuestaConsumo = new JsonParser().parse(responseBody).getAsJsonObject();
                return null;
            } else {
                respuestaConsumo = new JsonObject();
                respuestaConsumo.addProperty("statusCode", 200);
                JsonArray carreras = stringToJson(responseBody);
                if (carreras != null) {
                    respuestaConsumo.addProperty("message", "success");
                }
                return carreras;
            }
        }
    }

    public JsonArray doPostAsignaturas(String idCarrera) throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, InvalidAlgorithmParameterException, BadPaddingException, InvalidKeySpecException {
        String responseBody = "";
        String dataEncriptada = null;
        //Tomamos el token de accesso.
        jwtToken = request.getSession().getAttribute("access_token") + "";
        JsonObject jsonInicio = new JsonObject();
        //Validamos si el id de carrera es nulo
        if (idCarrera != null) {
            jsonInicio.addProperty("IDCARRERA", idCarrera);
            dataEncriptada = EncrypData.encryptData(jsonInicio.toString(), EncrypData.AES_KEY_SERVICE_CONSULTA);
        }
        //Inicializamos el objeto para consultar
        HttpPost httpPost = new HttpPost(URL_SERVICE + URL_SERVICE_ASIGNATURA);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization2", "Bearer " + jwtToken);
        if (dataEncriptada != null) {
            JsonObject cryptdata = new JsonObject();
            cryptdata.addProperty("cryptdata", dataEncriptada);
            String data = cryptdata.toString();
            HttpEntity entity = new StringEntity(data, "UTF-8");
            httpPost.setEntity(entity);
        }

        HttpClient httpClient = HttpClientBuilder.create().build();

        try (CloseableHttpResponse responseHandler = (CloseableHttpResponse) httpClient.execute(httpPost)) {
            StatusLine statusLine = responseHandler.getStatusLine();
            responseBody = EntityUtils.toString(responseHandler.getEntity(), StandardCharsets.UTF_8);
            if (statusLine.getStatusCode() != 200) {
                respuestaConsumo = new JsonParser().parse(responseBody).getAsJsonObject();
                return null;
            } else {
                respuestaConsumo = new JsonObject();
                respuestaConsumo.addProperty("statusCode", 200);
                JsonArray asignaturas = stringToJson(responseBody);
                if (asignaturas != null) {
                    respuestaConsumo.addProperty("message", "success");
                }
                return asignaturas;
            }
        }
    }

    public JsonArray doPostAlumnos(String idAlumno, String matricula) throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, InvalidAlgorithmParameterException, BadPaddingException, InvalidKeySpecException {
        String responseBody = "";
        String dataEncriptada = null;
        //Tomamos el token de accesso.
        jwtToken = request.getSession().getAttribute("access_token") + "";

        JsonObject jsonInicio = new JsonObject();
        jsonInicio.addProperty("ID", idAlumno);
        jsonInicio.addProperty("MATRICULA", matricula);

        dataEncriptada = EncrypData.encryptData(jsonInicio.toString(), EncrypData.AES_KEY_SERVICE_CONSULTA);

        //Inicializamos el objeto para consultar
        HttpPost httpPost = new HttpPost(URL_SERVICE + URL_SERVICE_ALUMNO);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization2", "Bearer " + jwtToken);
        if (dataEncriptada != null) {
            JsonObject cryptdata = new JsonObject();
            cryptdata.addProperty("cryptdata", dataEncriptada);
            String data = cryptdata.toString();
            HttpEntity entity = new StringEntity(data, "UTF-8");
            httpPost.setEntity(entity);
        }

        HttpClient httpClient = HttpClientBuilder.create().build();

        try (CloseableHttpResponse responseHandler = (CloseableHttpResponse) httpClient.execute(httpPost)) {
            StatusLine statusLine = responseHandler.getStatusLine();
            responseBody = EntityUtils.toString(responseHandler.getEntity(), StandardCharsets.UTF_8);
            if (statusLine.getStatusCode() != 200) {
                respuestaConsumo = new JsonParser().parse(responseBody).getAsJsonObject();
                return null;
            } else {
                respuestaConsumo = new JsonObject();
                respuestaConsumo.addProperty("statusCode", 200);
                JsonArray alumnos = stringToJson(responseBody);
                if (alumnos != null) {
                    respuestaConsumo.addProperty("message", "success");
                }
                return alumnos;
            }
        }
    }

    public JsonArray doPostCalificaciones(String idAlumno, String matricula) throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, InvalidAlgorithmParameterException, BadPaddingException, InvalidKeySpecException {
        String responseBody = "";
        String dataEncriptada = null;
        //Tomamos el token de accesso.
        jwtToken = request.getSession().getAttribute("access_token") + "";

        JsonObject jsonInicio = new JsonObject();
        jsonInicio.addProperty("ID", idAlumno);
        jsonInicio.addProperty("MATRICULA", matricula);

        dataEncriptada = EncrypData.encryptData(jsonInicio.toString(), EncrypData.AES_KEY_SERVICE_CONSULTA);

        //Inicializamos el objeto para consultar
        HttpPost httpPost = new HttpPost(URL_SERVICE + URL_SERVICE_CALIFICACION);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization2", "Bearer " + jwtToken);
        if (dataEncriptada != null) {
            JsonObject cryptdata = new JsonObject();
            cryptdata.addProperty("cryptdata", dataEncriptada);
            String data = cryptdata.toString();
            HttpEntity entity = new StringEntity(data, "UTF-8");
            httpPost.setEntity(entity);
        }

        HttpClient httpClient = HttpClientBuilder.create().build();

        try (CloseableHttpResponse responseHandler = (CloseableHttpResponse) httpClient.execute(httpPost)) {
            StatusLine statusLine = responseHandler.getStatusLine();
            responseBody = EntityUtils.toString(responseHandler.getEntity(), StandardCharsets.UTF_8);
            if (statusLine.getStatusCode() != 200) {
                respuestaConsumo = new JsonParser().parse(responseBody).getAsJsonObject();
                return null;
            } else {
                respuestaConsumo = new JsonObject();
                respuestaConsumo.addProperty("statusCode", 200);
                JsonArray calificaciones = stringToJson(responseBody);
                if (calificaciones != null) {
                    respuestaConsumo.addProperty("message", "success");
                }
                System.out.println(calificaciones);
                return calificaciones;
            }
        }

    }

    private String handleJWT(String serviceResponse) {
        JsonObject jwt = new JsonParser().parse(serviceResponse).getAsJsonObject();
        jwtToken = jwt.get("access_token").getAsString();
        request.getSession().setAttribute("access_token", jwtToken);
        return "success";
    }

    private JsonArray stringToJson(String data) throws IOException, NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, InvalidAlgorithmParameterException, BadPaddingException, InvalidKeySpecException {
        JsonObject resp = new JsonParser().parse(data).getAsJsonObject();
        if (resp.has("cryptdata")) {
            String cryptData = resp.get("cryptdata").getAsString();
            String dataDesencriptada = EncrypData.decryptData(cryptData, EncrypData.AES_KEY_SERVICE_CONSULTA);
            JsonArray json = new JsonParser().parse(dataDesencriptada).getAsJsonArray();
            return json;

        } else {
            respuestaConsumo = new JsonParser().parse(data).getAsJsonObject();
            //Sessión cannot be expired
            //There's an error, so we return respuestaConsumo
            return null;
        }
    }

    private String getDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy::HH:mm:ss");
        Calendar calendar = Calendar.getInstance(CENTRO); //cierto
        calendar.add(Calendar.SECOND, -60);
        calendar.add(Calendar.HOUR,-1 ); //pORQUE AMLO YA PUSO LA HORA NORMAL
        return sdf.format(calendar.getTime());
    }

    private boolean isJWTAlive() throws ParseException {
        jwtToken = request.getSession().getAttribute("access_token") + "";
        String[] chunks = jwtToken.split("\\.");
        Base64.Decoder decoder = Base64.getDecoder();
        String payload = new String(decoder.decode(chunks[1]));
        JsonObject bodyPayload = new JsonParser().parse(payload).getAsJsonObject();
        long timeStamp = bodyPayload.get("exp").getAsLong();
        Instant lognInstant = Instant.ofEpochSecond(timeStamp);
        lognInstant.atZone(CENTRO.toZoneId());
        Date expDate = Date.from(lognInstant);
        Date today = Date.from(Instant.now());
        //Regresa true si el jwt está vivo
        //Regresa false si el jwt está muerto
        return expDate.after(today);
    }
}
