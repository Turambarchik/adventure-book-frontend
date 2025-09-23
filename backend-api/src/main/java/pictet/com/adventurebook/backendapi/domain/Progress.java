package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Reading progress information for an adventure book")
public class Progress {
    @Schema(description = "Identifier of the book being read", example = "adventure_001")
    private String book;

    @Schema(description = "Section number where the reader left off", example = "15")
    private long section;
}
