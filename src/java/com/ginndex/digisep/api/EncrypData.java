/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ginndex.digisep.api;

import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.SecretKey;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 *
 * @author BSorcia
 */
public class EncrypData {

    public static final String AES_KEY_LOGIN = "nt&LqS?xAMH^z$-Kr8#TU9qh2KY%K+bV";
    public static final String AES_KEY_SERVICE_CONSULTA = "jzRqD&4agTtTCc!@D3FN=w3cpa47FL?2";
    private static final String IV_AES_SERVICE = "d1a7de36e894d0e2";

    public static String encryptData(String json, String secretKey) throws NoSuchAlgorithmException, NoSuchPaddingException,
            InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        Security.setProperty("crypto.policy", "unlimited");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        byte[] array = IV_AES_SERVICE.getBytes();
        IvParameterSpec ivParameterSpec = new IvParameterSpec(array);
        SecretKey key = convertStringToSecretKeyto(secretKey);
        cipher.init(Cipher.ENCRYPT_MODE, key, ivParameterSpec);
        byte[] cipherText = cipher.doFinal(json.getBytes());
        return Base64.getEncoder().encodeToString(cipherText);
    }

    public static String decryptData(String encryptedData, String secretKey) throws NoSuchAlgorithmException, NoSuchPaddingException, 
            InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException {
        Security.setProperty("crypto.policy", "unlimited");
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
        byte[] array = IV_AES_SERVICE.getBytes();
        IvParameterSpec ivParameterSpec = new IvParameterSpec(array);
        SecretKey key = convertStringToSecretKeyto(secretKey);
        cipher.init(Cipher.DECRYPT_MODE, key, ivParameterSpec);
        byte[] encryptedArray = Base64.getDecoder().decode(encryptedData);
        byte[] cipherText = cipher.doFinal(encryptedArray);
        return new String(cipherText, StandardCharsets.UTF_8);
    }

    private static SecretKey convertStringToSecretKeyto(String encodedKey) {
        byte[] decodedKey = encodedKey.getBytes();
        SecretKey originalKey = new SecretKeySpec(decodedKey, "AES");
        return originalKey;
    }
}
