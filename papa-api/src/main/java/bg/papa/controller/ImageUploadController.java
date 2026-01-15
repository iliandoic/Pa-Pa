package bg.papa.controller;

import bg.papa.service.ImageUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/images")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Image Upload", description = "Endpoints for image upload to Cloudflare R2")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10MB

    @PostMapping("/upload")
    @Operation(summary = "Upload a single image")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {

        Map<String, Object> response = new HashMap<>();

        // Validate file
        if (file.isEmpty()) {
            response.put("success", false);
            response.put("error", "File is empty");
            return ResponseEntity.badRequest().body(response);
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            response.put("success", false);
            response.put("error", "Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
            return ResponseEntity.badRequest().body(response);
        }

        if (file.getSize() > MAX_SIZE) {
            response.put("success", false);
            response.put("error", "File too large. Maximum size: 10MB");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            String url = imageUploadService.uploadImage(file, folder);
            response.put("success", true);
            response.put("url", url);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to upload image", e);
            response.put("success", false);
            response.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/upload-multiple")
    @Operation(summary = "Upload multiple images")
    public ResponseEntity<Map<String, Object>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {

        Map<String, Object> response = new HashMap<>();
        List<String> uploadedUrls = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                errors.add("Empty file skipped");
                continue;
            }

            if (!ALLOWED_TYPES.contains(file.getContentType())) {
                errors.add(file.getOriginalFilename() + ": Invalid file type");
                continue;
            }

            if (file.getSize() > MAX_SIZE) {
                errors.add(file.getOriginalFilename() + ": File too large");
                continue;
            }

            try {
                String url = imageUploadService.uploadImage(file, folder);
                uploadedUrls.add(url);
            } catch (Exception e) {
                log.error("Failed to upload {}", file.getOriginalFilename(), e);
                errors.add(file.getOriginalFilename() + ": " + e.getMessage());
            }
        }

        response.put("success", !uploadedUrls.isEmpty());
        response.put("urls", uploadedUrls);
        response.put("uploaded", uploadedUrls.size());
        response.put("failed", errors.size());
        if (!errors.isEmpty()) {
            response.put("errors", errors);
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    @Operation(summary = "Delete an image")
    public ResponseEntity<Map<String, Object>> deleteImage(@RequestParam("url") String imageUrl) {
        Map<String, Object> response = new HashMap<>();

        try {
            imageUploadService.deleteImage(imageUrl);
            response.put("success", true);
            response.put("message", "Image deleted");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete image: {}", imageUrl, e);
            response.put("success", false);
            response.put("error", "Delete failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
