package pfa.Repository;



import pfa.Entity.TableOrder;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TableOrderRepository extends MongoRepository<TableOrder, String> {
    // Vous pouvez ajouter des requêtes personnalisées si nécessaire, par exemple :
    // List<TableOrder> findByStatus(String status);
}