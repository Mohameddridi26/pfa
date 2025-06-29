package pfa;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() {
        assertNotNull(dataSource);
        try (Connection connection = dataSource.getConnection()) {
            assertTrue(connection.isValid(5));
            System.out.println("Database connection successful!");
        } catch (SQLException e) {
            fail("Failed to connect to the database: " + e.getMessage());
        }
    }
}
