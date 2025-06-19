
# 🧱 Principios SOLID aplicados en TypeScript

## ¿Qué es SOLID?

**SOLID** es un conjunto de 5 principios de diseño orientado a objetos que ayudan a construir software flexible, mantenible y escalable.

| Letra | Principio                               | Descripción breve |
|-------|------------------------------------------|-------------------|
| S     | **Single Responsibility Principle**      | Una clase debe tener una sola razón para cambiar |
| O     | **Open/Closed Principle**                | El código debe estar abierto para extensión, pero cerrado para modificación |
| L     | **Liskov Substitution Principle**        | Una subclase debe poder sustituir a su clase base sin romper el programa |
| I     | **Interface Segregation Principle**      | Las interfaces deben ser específicas y no obligar a implementar métodos innecesarios |
| D     | **Dependency Inversion Principle**       | Las dependencias deben ser inyectadas mediante abstracciones, no clases concretas |

---

## 🔧 Aplicación práctica en TypeScript

### ✅ S – Single Responsibility Principle

```ts
// ❌ Mal: múltiples responsabilidades
class UserManager {
  createUser() { /* ... */ }
  logToFile() { /* ... */ }
}

// ✅ Bien: responsabilidad única
class UserService {
  createUser() { /* ... */ }
}

class LoggerService {
  logToFile() { /* ... */ }
}
```

---

### ✅ O – Open/Closed Principle

```ts
// Abierto a extensión sin modificar lo existente
interface PaymentStrategy {
  pay(amount: number): void;
}

class PaypalPayment implements PaymentStrategy {
  pay(amount: number) { /* ... */ }
}

class StripePayment implements PaymentStrategy {
  pay(amount: number) { /* ... */ }
}
```

---

### ✅ L – Liskov Substitution Principle

```ts
class Bird {
  fly() {}
}

class Duck extends Bird {}

class Penguin extends Bird {
  // ❌ No respeta LSP, porque Penguin no puede volar
  fly() {
    throw new Error("I can't fly!");
  }
}

// ✅ Mejor: usar interfaces separadas
interface FlyingBird {
  fly(): void;
}

interface SwimmingBird {
  swim(): void;
}
```

---

### ✅ I – Interface Segregation Principle

```ts
// ❌ Mal: interfaz forzando implementación innecesaria
interface Worker {
  work(): void;
  eat(): void;
}

class Robot implements Worker {
  work() { /* ... */ }
  eat() { throw new Error("Robots don’t eat"); }
}

// ✅ Bien: interfaces separadas
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}
```

---

### ✅ D – Dependency Inversion Principle

```ts
// ❌ Mal: dependencias concretas
class Notification {
  private emailService = new EmailService();
  send(msg: string) {
    this.emailService.send(msg);
  }
}

// ✅ Bien: dependencias por abstracción
interface IMessageService {
  send(msg: string): void;
}

class EmailService implements IMessageService {
  send(msg: string) { /* ... */ }
}

class Notification {
  constructor(private service: IMessageService) {}
  send(msg: string) {
    this.service.send(msg);
  }
}
```
