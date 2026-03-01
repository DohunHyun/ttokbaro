package com.ttokbaro.api.admin;

import com.ttokbaro.api.datago.DataGoKrClient;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Profile("local")
@RestController
@RequestMapping("/admin/datago")
public class DataGoKrAdminController {

    private final DataGoKrClient dataGoKrClient;

    public DataGoKrAdminController(DataGoKrClient dataGoKrClient) {
        this.dataGoKrClient = dataGoKrClient;
    }

    @GetMapping("/sg-codes")
    public String getSgCodes(
            @RequestParam(defaultValue = "50") String numOfRows,
            @RequestParam(defaultValue = "1") String pageNo
    ) {
        return dataGoKrClient.getRaw(
                "/9760000/CommonCodeService/getCommonSgCodeList",
                Map.of(
                        "numOfRows", numOfRows,
                        "pageNo", pageNo
                )
        );
    }

    @GetMapping("/candidates/seoul")
    public String candidatesSeoul(
            @RequestParam(defaultValue = "20260603") String sgId,
            @RequestParam String sgTypecode,
            @RequestParam(defaultValue = "50") String numOfRows,
            @RequestParam(defaultValue = "1") String pageNo,
            @RequestParam(name = "_type", required = false) String type
    ) {
        Map<String, String> queryParams = new LinkedHashMap<>();
        queryParams.put("sgId", sgId);
        queryParams.put("sgTypecode", sgTypecode);
        queryParams.put("sdName", "서울특별시");
        queryParams.put("numOfRows", numOfRows);
        queryParams.put("pageNo", pageNo);
        if (type != null && !type.isBlank()) {
            queryParams.put("_type", type);
        }

        return dataGoKrClient.getRaw(
                "/9760000/PofelcddInfoInqireService/getPoelpcddRegistSttusInfoInqire",
                queryParams
        );
    }
}
