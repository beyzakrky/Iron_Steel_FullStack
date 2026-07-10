package com.example.demo.service;
import com.example.demo.entity.Campaign;
import com.example.demo.repository.CampaignRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CampaignService {
    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }
}