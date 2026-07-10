package com.example.demo.controller;
import com.example.demo.entity.Campaign;
import com.example.demo.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
public class CampaignController {
    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }
}