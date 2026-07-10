// İş mantığı burada dönüyor. 
// Uygulamaya uyarılar ve komutlar burada veriliyor: 
// Satış temsilcisi riskli bir müşteriyi görüntülüyorsa logla
// veya borç durumu limitin yüzde sekseninin aştıysa mobil uygulamaya uyarı kodu göndersin gibi

package com.example.demo.service;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository; 

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll(); 
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Müşteri bulunamadı! ID: " + id));
    }
}