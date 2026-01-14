package bg.papa.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@ConfigurationProperties(prefix = "mistral.api")
@Data
public class MistralConfig {

    private String baseUrl;
    private String username;
    private String password;
    private String locationId;
    private String priceId;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
