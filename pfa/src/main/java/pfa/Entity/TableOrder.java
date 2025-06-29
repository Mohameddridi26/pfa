package pfa.Entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "tableOrders")
public class TableOrder {
    @Id
    private String id;
    private int tableNumber;
    private String status; // NOUVELLE, EN COURS, PRÊTE
    private List<Item> items;
    private String specialInstructions;
    private String preparationTime; // ex: "5min", "12min"
    private int articlesCount;
    private Date timestamp;

    // Constructeurs
    public TableOrder() {}

    public TableOrder(int tableNumber, String status, List<Item> items, String specialInstructions,
                      String preparationTime, int articlesCount, Date timestamp) {
        this.tableNumber = tableNumber;
        this.status = status;
        this.items = items;
        this.specialInstructions = specialInstructions;
        this.preparationTime = preparationTime;
        this.articlesCount = articlesCount;
        this.timestamp = timestamp;
    }

    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public int getTableNumber() { return tableNumber; }
    public void setTableNumber(int tableNumber) { this.tableNumber = tableNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public String getPreparationTime() { return preparationTime; }
    public void setPreparationTime(String preparationTime) { this.preparationTime = preparationTime; }
    public int getArticlesCount() { return articlesCount; }
    public void setArticlesCount(int articlesCount) { this.articlesCount = articlesCount; }
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}

class Item {
    private String name;
    private String type; // PLAT, ENTRÉE, DESSERT, BOISSON
    private int quantity;

    // Constructeurs
    public Item() {}
    public Item(String name, String type, int quantity) {
        this.name = name;
        this.type = type;
        this.quantity = quantity;
    }

    // Getters et Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}