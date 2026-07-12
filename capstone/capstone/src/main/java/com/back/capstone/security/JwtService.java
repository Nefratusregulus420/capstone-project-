package com.back.capstone.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import java.nio.charset.StandardCharsets; import java.util.*; import javax.crypto.SecretKey; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
@Service public class JwtService {
 private final SecretKey key; private final long expiration;
 public JwtService(@Value("${jwt.secret}") String secret,@Value("${jwt.expiration-ms}") long expiration){this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.expiration=expiration;}
 public String generate(String username){Date now=new Date();return Jwts.builder().subject(username).issuedAt(now).expiration(new Date(now.getTime()+expiration)).signWith(key).compact();}
 public String username(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();}
 public boolean valid(String token){try{username(token);return true;}catch(JwtException|IllegalArgumentException e){return false;}}
}
