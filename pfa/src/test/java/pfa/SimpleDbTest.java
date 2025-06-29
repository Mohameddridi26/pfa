package pfa;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class SimpleDbTest {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/pfa?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        String user = "root";
        String password = "root";
        
        System.out.println("Testing database connection...");
        
        try (Connection connection = DriverManager.getConnection(url, user, password)) {
            System.out.println("✅ Database connection successful!");
            System.out.println("Database: " + connection.getCatalog());
            System.out.println("Auto-commit: " + connection.getAutoCommit());
        } catch (SQLException e) {
            System.err.println("❌ Database connection failed!");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error code: " + e.getErrorCode());
            e.printStackTrace();
        }
    }
}
