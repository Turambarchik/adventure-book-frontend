package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "Consequence that occurs when a specific option is chosen")
class Consequence {
    @Schema(description = "Type of consequence (e.g., health, inventory, skill)", example = "health")
    private String type;

    @Schema(description = "Numeric or text value of the consequence", example = "-10")
    private String value;

    @Schema(description = "Descriptive text explaining what happens", example = "You lose 10 health points")
    private String text;
}
