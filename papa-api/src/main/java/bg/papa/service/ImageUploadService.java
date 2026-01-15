package bg.papa.service;

import bg.papa.config.R2Config;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUploadService {

    private final S3Client s3Client;
    private final R2Config r2Config;

    private static final int TARGET_SIZE = 1000;  // Unified size for all images
    private static final double QUALITY = 0.85;

    /**
     * Upload an image to R2 storage with optimization
     * - Resizes to max 1200x1200 if larger
     * - Compresses to JPEG at 80% quality (good balance of size/quality)
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            throw new IOException("Could not read image file");
        }

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        long originalSize = file.getSize();

        // Optimize image
        byte[] optimizedImage = optimizeImage(originalImage);

        // Generate unique filename
        String filename = UUID.randomUUID().toString() + ".jpg";
        String key = folder != null && !folder.isEmpty()
                ? folder + "/" + filename
                : filename;

        double reductionPercent = (1 - (double) optimizedImage.length / originalSize) * 100;
        log.info("Uploading optimized image: {} ({}x{}, {} KB -> {} KB, {}% reduction)",
                key, originalWidth, originalHeight,
                originalSize / 1024, optimizedImage.length / 1024,
                String.format("%.0f", reductionPercent));

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(r2Config.getBucket())
                .key(key)
                .contentType("image/jpeg")
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(optimizedImage));

        String publicUrl = r2Config.getPublicUrl() + "/" + key;
        log.info("Image uploaded successfully: {}", publicUrl);

        return publicUrl;
    }

    /**
     * Optimize image: resize to unified 1000x1000 and compress
     * Uses high-quality bicubic interpolation
     */
    private byte[] optimizeImage(BufferedImage original) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Always resize to exactly TARGET_SIZE x TARGET_SIZE
        // Frontend already crops to square, this ensures consistent dimensions
        Thumbnails.of(original)
                .forceSize(TARGET_SIZE, TARGET_SIZE)
                .outputFormat("jpg")
                .outputQuality(QUALITY)
                .toOutputStream(outputStream);

        return outputStream.toByteArray();
    }

    /**
     * Delete an image from R2 storage
     */
    public void deleteImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(r2Config.getPublicUrl())) {
            log.warn("Invalid image URL for deletion: {}", imageUrl);
            return;
        }

        String key = imageUrl.replace(r2Config.getPublicUrl() + "/", "");
        log.info("Deleting image: {} from bucket: {}", key, r2Config.getBucket());

        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(r2Config.getBucket())
                .key(key)
                .build();

        s3Client.deleteObject(request);
        log.info("Image deleted successfully: {}", key);
    }
}
