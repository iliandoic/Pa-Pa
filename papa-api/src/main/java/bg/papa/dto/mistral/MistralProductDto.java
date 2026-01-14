package bg.papa.dto.mistral;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MistralProductDto {

    @JsonProperty("UCode")
    private Integer uCode;

    @JsonProperty("Code")
    private String code;

    @JsonProperty("StoreCode")
    private String storeCode;

    @JsonProperty("StoreName")
    private String storeName;

    @JsonProperty("Name")
    private String name;

    @JsonProperty("Mea")
    private String mea;

    @JsonProperty("SalesPrice")
    private String salesPrice;

    @JsonProperty("BaseSalePrice")
    private BigDecimal baseSalePrice;

    @JsonProperty("Discount")
    private String discount;

    @JsonProperty("LastDeliveryPrice")
    private String lastDeliveryPrice;

    @JsonProperty("Qtty")
    private String qtty;

    @JsonProperty("Atr1")
    private String atr1;

    @JsonProperty("Atr2")
    private String atr2;

    @JsonProperty("Atr3")
    private String atr3;

    @JsonProperty("Atr4")
    private String atr4;

    @JsonProperty("Atr5")
    private String atr5;

    @JsonProperty("Group")
    private String group;

    @JsonProperty("Specific")
    private String specific;

    @JsonProperty("PrinterId")
    private String printerId;

    @JsonProperty("PrinterName")
    private String printerName;

    @JsonProperty("DanGroup")
    private String danGroup;

    @JsonProperty("AltDanGroup")
    private String altDanGroup;

    @JsonProperty("BarcodeDefQtty")
    private Integer barcodeDefQtty;

    @JsonProperty("Lots")
    private List<Object> lots;

    @JsonProperty("Description")
    private String description;

    @JsonProperty("Url")
    private String url;

    @JsonProperty("Barcode")
    private String barcode;

    @JsonProperty("CategoryName")
    private String categoryName;

    @JsonProperty("Active")
    private Integer active;

    @JsonProperty("KindType")
    private Integer kindType;

    @JsonProperty("TagNames")
    private String tagNames;

    @JsonProperty("DeliveryBlock")
    private String deliveryBlock;

    @JsonProperty("Producer")
    private String producer;

    @JsonProperty("TypeMaterial")
    private String typeMaterial;

    @JsonProperty("StorageCondition")
    private String storageCondition;

    @JsonProperty("TypeMaterialId")
    private String typeMaterialId;

    @JsonProperty("StorageConditionId")
    private String storageConditionId;

    @JsonProperty("Attributes")
    private List<Object> attributes;

    @JsonProperty("PromotionSalesPriceId")
    private String promotionSalesPriceId;

    @JsonProperty("PromoActiveFrom")
    private String promoActiveFrom;

    @JsonProperty("PromoActiveTo")
    private String promoActiveTo;

    @JsonProperty("Tax")
    private Integer tax;

    @JsonProperty("MinKol")
    private String minKol;

    @JsonProperty("CanSales")
    private String canSales;

    @JsonProperty("SalesArtNomer")
    private String salesArtNomer;

    @JsonProperty("AvgPrice")
    private BigDecimal avgPrice;

    @JsonProperty("DefPartnerNum")
    private Integer defPartnerNum;

    // Helper methods
    public BigDecimal getSalesPriceAsBigDecimal() {
        try {
            return salesPrice != null ? new BigDecimal(salesPrice) : BigDecimal.ZERO;
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }

    public Integer getQttyAsInteger() {
        try {
            return qtty != null ? Integer.parseInt(qtty) : 0;
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
