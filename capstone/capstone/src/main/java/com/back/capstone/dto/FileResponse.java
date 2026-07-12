package com.back.capstone.dto;
import java.time.Instant;
public record FileResponse(Long id,String originalName,String mimeType,String extension,long size,String category,Instant uploadedAt,String contentUrl,String downloadUrl){}
