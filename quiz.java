import java.util.Scanner;

public class quiz {
    public static void main(String[] args) {
        String[] questions = {
                "What is the capital of France?",
                "What is 2 + 2?",
                "Which planet is known as the Red Planet?",
                "What is the largest ocean on Earth?"
        };

        String[][] options = {
                { "1. Paris", "2. London", "3. Berlin", "4. Rome" },
                { "1. 3", "2. 4", "3. 5", "4. 6" },
                { "1. Venus", "2. Mars", "3. Jupiter", "4. Saturn" },
                { "1. Atlantic Ocean", "2. Indian Ocean", "3. Pacific Ocean", "4. Arctic Ocean" }
        };

        int[] answers = { 1, 2, 2, 3 };
        int score = 0;
        int guess;

        Scanner input = new Scanner(System.in);

        System.out.println("****************************");
        System.out.println("welcome to the quiz");
        System.out.println("****************************");

        for (int i = 0; i < questions.length; i++) {
            System.out.println(questions[i]);
            for (int j = 0; j < options[i].length; j++) {
                System.out.println(options[i][j]);
            }
            System.out.println("Enter your answer (1-4)");
            guess = input.nextInt();

            if (guess == answers[i]) {
                score++;
                System.out.println("Correct answer");
            } else {
                System.out.println("Wrong answer");
            }
        }

        System.out.println("Your score is: " + score + " / " + questions.length);
    }
}
