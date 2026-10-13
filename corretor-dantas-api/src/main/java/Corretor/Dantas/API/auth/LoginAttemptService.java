package Corretor.Dantas.API.auth;

import Corretor.Dantas.API.exception.TooManyAttemptsException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_FAILURES_PER_ACCOUNT = 5;
    private static final int MAX_FAILURES_PER_IP = 20;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    private static final int CLEANUP_THRESHOLD = 10_000;

    private record Entry(int failures, Instant windowStart) {
        boolean expired() {
            return windowStart.plus(WINDOW).isBefore(Instant.now());
        }
    }

    private final ConcurrentHashMap<String, Entry> attempts =
            new ConcurrentHashMap<>();

    public void checkAllowed(String ip, String email) {
        long wait = Math.max(
                remainingSeconds(ipKey(ip), MAX_FAILURES_PER_IP),
                remainingSeconds(accountKey(ip, email), MAX_FAILURES_PER_ACCOUNT)
        );

        if (wait > 0) {
            throw new TooManyAttemptsException(wait);
        }
    }

    public void recordFailure(String ip, String email) {
        increment(ipKey(ip));
        increment(accountKey(ip, email));

        if (attempts.size() > CLEANUP_THRESHOLD) {
            attempts.entrySet().removeIf(e -> e.getValue().expired());
        }
    }

    public void reset(String ip, String email) {
        attempts.remove(accountKey(ip, email));
    }

    private void increment(String key) {
        attempts.compute(key, (k, current) ->
                current == null || current.expired()
                        ? new Entry(1, Instant.now())
                        : new Entry(current.failures() + 1, current.windowStart())
        );
    }

    private long remainingSeconds(String key, int max) {
        Entry entry = attempts.get(key);

        if (entry == null || entry.expired() || entry.failures() < max) {
            return 0;
        }

        long left = Duration
                .between(Instant.now(), entry.windowStart().plus(WINDOW))
                .getSeconds();

        return Math.max(left, 1);
    }

    private String ipKey(String ip) {
        return "ip:" + ip;
    }

    private String accountKey(String ip, String email) {
        return "acc:" + ip + "|" + email;
    }
}