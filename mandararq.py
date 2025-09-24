import os 

user_input = input("Qual arquivo deseja mandar \n1-Server\n2-Script\n3-HTML\n4-todos\n5-css\n")
server = "scp C:/Users/tcc/server.js mottaaryana@192.168.0.97:/home/mottaaryana/tcc"
script = "scp C:/Users/tcc/script.js mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
html = "scp C:/Users/tcc/HTML/menu.html mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
html2 = "scp C:/Users/tcc/HTML/página_inicial.html mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
html3 = "scp C:/Users/tcc/HTML/configurar.html mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
html4 = "scp C:/Users/tcc/HTML/verhorarios.html mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
html5 = "scp C:/Users/tcc/HTML/programar.html mottaaryana@192.168.0.97:/home/mottaaryana/tcc/HTML"
#obs: lembre-se de trocar o ip caso o rasp esteja conectado a rede do celular
if user_input == '1':
    os.system(server)
    print("Server enviado")
elif user_input == '2':
    os.system(script)
    print("Script enviado")
elif user_input == '3':
    os.system(html)
    os.system(html2)
    os.system(html3)
    os.system(html4)
    os.system(html5)
    print("HTML enviado")
elif user_input == '4':
    os.system(server)
    os.system(script)
    os.system(html)
    print("Todos foram enviados")
else:
    print("Opção inválida")
    

