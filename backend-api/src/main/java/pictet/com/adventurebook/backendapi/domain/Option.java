package pictet.com.adventurebook.backendapi.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Schema(description = "A choice option available to the reader in an adventure book section")
class Option {
    @Schema(description = "Text description of the choice option", example = "Take the left path through the forest")
    private String description;

    @Schema(description = "ID of the section to navigate to when this option is selected", example = "section_005")
    private String gotoId;

    @Schema(description = "Consequence that occurs when this option is selected")
    private Consequence consequence;
}
