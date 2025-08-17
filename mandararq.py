import os 

user_input = input("Qual arquivo deseja mandar \n1-Server\n2-Script\n3-HTML\n4-todos\n")
server = "scp C:/Users/tcc/server.js mottaaryana@192.168.0.97:/home/mottaaryana/tcc"
script = "scp C:/Users/tcc/script.js mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
html = "scp C:/Users/tcc/HTML/teste.html mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
if user_input == '1':
    os.system(server)
    print("Server enviado")
elif user_input == '2':
    os.system(script)
    print("Script enviado")
elif user_input == '3':
    os.system(html)
    print("HTML enviado")
elif user_input == '4':
    os.system(server)
    os.system(script)
    os.system(html)
    print("Todos foram enviados")
else:
    print("Opção inválida")
    