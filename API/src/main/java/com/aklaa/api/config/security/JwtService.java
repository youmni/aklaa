package com.aklaa.api.config.security;

import com.aklaa.api.exceptions.JwtCreationException;
import com.aklaa.api.exceptions.JwtParseException;
import com.aklaa.api.model.enums.UserType;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;

@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(long id, UserType role) {
        try {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.MINUTE, 2);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(String.valueOf(id))
                    .claim("role", role)
                    .claim("type", "access")
                    .expirationTime(cal.getTime())
                    .build();

            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            JWSSigner signer = new MACSigner(secret);

            signedJWT.sign(signer);
            return signedJWT.serialize();

        } catch (JOSEException e) {
            throw new JwtCreationException("Failed to generate JWT access token", e);
        }
    }

    public String generateRefreshToken(long id, UserType role) {
        try {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_MONTH, 7);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(String.valueOf(id))
                    .claim("role", role)
                    .claim("type", "refresh")
                    .expirationTime(cal.getTime())
                    .build();

            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            JWSSigner signer = new MACSigner(secret);

            signedJWT.sign(signer);
            return signedJWT.serialize();

        } catch (JOSEException e) {
            throw new JwtCreationException("Failed to generate JWT refresh token", e);
        }
    }

    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(secret);
            return signedJWT.verify(verifier) && !isTokenExpired(signedJWT);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(SignedJWT signedJWT) {
        try {
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            return expirationTime.before(new Date());
        } catch (ParseException e) {
            throw new JwtParseException("Failed to read expiration time from JWT", e);
        }
    }

    public String getSubject(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new JwtParseException("Failed to parse JWT token", e);
        }
    }

    public UserType getRoleFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String role = signedJWT.getJWTClaimsSet().getStringClaim("role");

            if (role == null) {
                throw new JwtParseException("JWT token missing 'role' claim", null);
            }

            return UserType.valueOf(role);

        } catch (ParseException e) {
            throw new JwtParseException("Failed to parse role from JWT", e);
        } catch (IllegalArgumentException e) {
            throw new JwtParseException("Invalid role value inside JWT", e);
        }
    }

    public String getClaim(String token, String claim) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getStringClaim(claim);
        } catch (ParseException e) {
            throw new JwtParseException("Failed to parse claim '" + claim + "' from JWT", e);
        }
    }
}