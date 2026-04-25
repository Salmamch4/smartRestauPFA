import com.smartpfa.orderservice.entity.Ticket;
import java.util.List;

public interface TicketService {

    Ticket createTicket(Ticket ticket);

    List<Ticket> getAll();

    // 🔥 serveur (اليوم)
    List<Ticket> getServeurTickets(String serveur);

    double getServeurTotal(String serveur);

    // 🔥 admin (اليوم)
    List<Ticket> getAdminTickets();

    double getAdminTotal();

    Ticket update(Long id, Ticket newTicket);

    void delete(Long id);

	void clearSession() ;
}