
export let rl = require("readline-sync"); 
import { Icliente, ICorrente, IPoupanca } from "./interfaces"; 

// Classe base ContaBancaria 
export class ContaBancaria implements Icliente {
    Id: number; // Identificador único da conta
    Nome: string; // Nome do titular da conta
    Email: string; // Email do titular da conta
    Senha: number; // Senha da conta para autenticação
    Saldo: number; // Saldo atual da conta
    Historico: string[]; // Histórico das transações realizadas na conta
    Depositar: any;

    constructor(Id: number, Nome: string, Email: string, Senha: number, Saldo: number) {
        this.Id = Id;
        this.Nome = Nome;
        this.Email = Email;
        this.Senha = Senha;
        this.Saldo = Saldo;
        this.Historico = []; // Inicializa o histórico de transações como um array vazio
    }

    // Método para gerar e exibir um extrato bancário detalhado
    GerarExtrato(): void {
        console.clear();
        console.log("===== EXTRATO BANCÁRIO DETALHADO ====="); 
        console.log(`Conta: ${this.Nome} (ID: ${this.Id})`); // Mostra o nome e ID do titular da conta
        console.log(`Saldo Inicial: R$${this.Saldo.toFixed(2)}`); // Mostra o saldo inicial da conta
        console.log("------------------------------------------------------");

        // Itera sobre o histórico de transações e Mostra cada uma
        this.Historico.forEach((transacao, index) => {
            console.log(`${index + 1}. ${transacao}`); // Mostra a transação com seu índice
        });

        console.log("------------------------------------------------------");
        console.log(`Saldo Final: R$${this.Saldo.toFixed(2)}`); // Mostra o saldo final da conta
    }

    SaldoAtual(): number {
        return this.Saldo; // Retorna o saldo atual da conta
    }
}

// Classe ContaCorrente, que herda de ContaBancaria e implementa a interface ICorrente
export class ContaCorrente extends ContaBancaria implements ICorrente {
    Sacar: any;
    // Método para depositar um valor na conta corrente
    DepositarCorrente(valor: number): void  {
        console.clear();
        // Valida se o valor do depósito é positivo
        if (valor <= 0) throw new Error("O valor do depósito deve ser positivo."); 
        this.Saldo += valor; // Adiciona o valor ao saldo atual
        // Adiciona a transação ao histórico
        this.Historico.push(`Depósito: R$${valor.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`); 
        // Mostra a confirmação do depósito
        console.log(`Depósito de R$${valor.toFixed(2)} realizado. Novo saldo: R$${this.Saldo.toFixed(2)}`); 
    }

    // Método para sacar um valor da conta corrente
    SacarCorrente(valor: number): void{
        console.clear();
        // Valida se o valor do saque é positivo
        if (valor <= 0) throw new Error("O valor do saque deve ser positivo.");
         // Verifica se há saldo suficiente para o saque 
        if (valor > this.Saldo) throw new Error("Saldo insuficiente.");
        this.Saldo -= valor; // Subtrai o valor do saldo atual
        // Adiciona a transação ao histórico
        this.Historico.push(`Saque: R$${valor.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`); 
        // Mostra a confirmação do saque
        console.log(`Saque de R$${valor.toFixed(2)} realizado. Novo saldo: R$${this.Saldo.toFixed(2)}`);
    }

    // Método para transferir um valor para outra conta bancária
    TransferirCorrente(valor: number, contaDestino: ContaBancaria): void  {
        console.clear();
         // Valida se o valor da transferência é positivo
        if (valor <= 0) throw new Error("O valor da transferência deve ser positivo.");
        // Verifica se há saldo suficiente para a transferência
        if (valor > this.Saldo) throw new Error("Saldo insuficiente para transferência."); 
        this.Sacar(valor); // Realiza o saque do valor na conta de origem
        contaDestino.Depositar(valor); // Realiza o depósito do valor na conta de destino
        this.Historico.push(`Transferência para ${contaDestino.Nome}: R$${valor.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`); // Adiciona a transação ao histórico
        // Mostra a confirmação da transferência
        console.log(`Transferência de R$${valor.toFixed(2)} realizada para ${contaDestino.Nome}.`); 
    }
}

// Classe ContaPoupanca, que herda de ContaBancaria e implementa a interface IPoupanca
export class ContaPoupanca extends ContaBancaria implements IPoupanca {
    Sacar: any;

    // Método para depositar um valor na conta poupança
    DepositarPoupanca(valor: number): void{
        console.clear();
        // Valida se o valor do depósito é positivo
        if (valor <= 0) throw new Error("O valor do depósito deve ser positivo."); 
        this.Saldo += valor; // Adiciona o valor ao saldo atual
        // Adiciona a transação ao histórico
        this.Historico.push(`Depósito: R$${valor.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`); 
        // Mostra a confirmação do depósito
        console.log(`Depósito de R$${valor.toFixed(2)} realizado. Novo saldo: R$${this.Saldo.toFixed(2)}`); 
    }

    // Método para sacar um valor da conta poupança
    SacarPoupanca(valor: number): void{
        console.clear();
        // Valida se o valor do saque é positivo
        if (valor <= 0) throw new Error("O valor do saque deve ser positivo.");
        // Verifica se há saldo suficiente para o saque 
        if (valor > this.Saldo) throw new Error("Saldo insuficiente."); 
        this.Saldo -= valor; // Subtrai o valor do saldo atual
         // Adiciona a transação ao histórico
        this.Historico.push(`Saque: R$${valor.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`);
         // Mostra a confirmação do saque
        console.log(`Saque de R$${valor.toFixed(2)} realizado. Novo saldo: R$${this.Saldo.toFixed(2)}`);
    }

    // Método para transferir um valor para outra conta bancária
    TransferirPopanca(valor: number, contaDestino: ContaBancaria): void {
        console.clear();
        // Valida se o valor da transferência é positivo
        if (valor <= 0) throw new Error("O valor da transferência deve ser positivo."); 
        // Verifica se há saldo suficiente para a transferência
        if (valor > this.Saldo) throw new Error("Saldo insuficiente para transferência."); 
        this.Sacar(valor); // Realiza o saque do valor na conta de origem
        contaDestino.Depositar(valor); // Realiza o depósito do valor na conta de destino
        this.Historico.push(`Transferência para ${contaDestino.Nome}: R$${valor.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`); // Adiciona a transação ao histórico
        // Mostra a confirmação da transferência
        console.log(`Transferência de R$${valor.toFixed(2)} realizada para ${contaDestino.Nome}.`); 
    }

    // Método para aplicar juros ao saldo da conta poupança
    AplicarJuros(taxa: number): void{
        console.clear();
        // Valida se a taxa de juros é positiva
        if (taxa <= 0) throw new Error("A taxa de juros deve ser positiva."); 
        // Calcula o valor dos juros com base no saldo e na taxa fornecida
        const juros = this.Saldo * (taxa / 100); 
        this.Saldo += juros; // Adiciona os juros ao saldo atual
        // Adiciona a transação de juros ao histórico
        this.Historico.push(`Juros aplicados: R$${juros.toFixed(2)} - Saldo: R$${this.Saldo.toFixed(2)}`);
         // Mostra a confirmação da aplicação de juros 
        console.log(`Juros de R$${juros.toFixed(2)} aplicados. Novo saldo: R$${this.Saldo.toFixed(2)}`);
    }
}
