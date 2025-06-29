package pfa.Service;


import pfa.Entity.TableOrder;
import pfa.Repository.TableOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TableOrderService {
    @Autowired
    private TableOrderRepository repository;

    public List<TableOrder> getAllOrders() {
        return repository.findAll();
    }

    public Optional<TableOrder> getOrderById(String id) {
        return repository.findById(id);
    }

    public TableOrder addOrder(TableOrder order) {
        return repository.save(order);
    }

    public TableOrder updateOrder(String id, TableOrder orderDetails) {
        Optional<TableOrder> optionalOrder = repository.findById(id);
        if (optionalOrder.isPresent()) {
            TableOrder order = optionalOrder.get();
            order.setStatus(orderDetails.getStatus());
            order.setItems(orderDetails.getItems());
            order.setSpecialInstructions(orderDetails.getSpecialInstructions());
            order.setPreparationTime(orderDetails.getPreparationTime());
            order.setArticlesCount(orderDetails.getArticlesCount());
            return repository.save(order);
        }
        return null;
    }

    public void deleteOrder(String id) {
        repository.deleteById(id);
    }
}