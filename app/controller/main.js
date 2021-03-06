"use strict";
//Unikey é uma função que cria um chave aleatoria
//Section é uma função que cria uma div com um id e uma classe
//nText é uma função que cria um elemento text, com uma classe
//Button é uma função que cria um botão que contém nele um id, classe, o que há dentro do html dele e uma função click
//Space é uma função que cria uma div que da um espaço vertical com um parametro que eu passar dentro em px
//Icon é uma função que pega um icone em svg do site FontAwesome
//InputField é uma função cria um campo input
//Mask é uma mascara que pode ser colocada num input
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCXGjzx00TjaqjbmLSqIk5U1RYVtVxAJ-8",
    authDomain: "nipponatt.firebaseapp.com",
    projectId: "nipponatt",
    storageBucket: "nipponatt.appspot.com",
    messagingSenderId: "167548057096",
    appId: "1:167548057096:web:43b9fd3e741c2b565b03bd",
    measurementId: "G-2HWGGX2KSB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var firestore = firebase.firestore();

$(() => {
    const allBody = Section(uniKey(), { classNameB: "allBody" });
    const navBarSection = Section(uniKey(), { classNameB: "nav-bar-section" });
    const modalCreateUnique = Section('modal-create-unique', { classNameB: "modal-pop modalCreateUnique" });
    const modalCreateUniqueContent = Section('modal-create-unique-content', { classNameB: "modalCreateUniqueContent" });
    $(modalCreateUnique).html(modalCreateUniqueContent);

    const add_contact = Button(uniKey(), {
        classNameB: "button-7 button-add",
        content: [Icon('id-card'), ' Adicionar contato'],
        click: (() => {
            modalUnique()
        })
    })
    const inputSearch = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "Digite aqui o campo para a pesquisa",
        onchange: (() => {
            filter(inputSearch.value)
        })
    });
    let userRef = firestore.collection('users').limit(20)

    const allBodyContent = Section(uniKey(), { classNameB: "allBodyContent" });

    // contacts.push(docUser)
    userRef.onSnapshot((snapshot) => {
        $(allBodyContent).html('');
        snapshot.forEach((doc) => {
            let docUser =  doc.data();
            const contact = Button(docUser.id, {
                classNameB: "button-7 buttonContact",
                content: [nText({ text: docUser.name }), nText({ text: docUser.email }), nText({ text: docUser.number }),],
                click: (() => {
                    modalUnique(docUser.id)
                })
            })
            $(allBodyContent).append([
                contact
            ]);
            
        })
    })
    $(allBody).append([
        allBodyContent
    ]);
    const typeBody = Section(uniKey(), { classNameB: "typeBody" });

    $(typeBody).html([
        nText({ text: "Nome", classNameB: "typeBodyName" }),
        nText({ text: "Email", classNameB: "typeBodyName" }),
        nText({ text: "Telefone", classNameB: "typeBodyFone" }),
    ]);

    $(navBarSection).html([
        inputSearch,
        space(10),
        add_contact,
    ]);
    $("#root").html([
        navBarSection,
        space(20),
        typeBody,
        allBody,
        modalCreateUnique
    ]);
})

const modalUnique = async (id = '') => {
    $("#modal-create-unique-content").html("")
    $.fancybox.open({ src: "#modal-create-unique", touch: false, keyboard: false });
    let docUser;
    if(id!=''){
        let userRef = firestore.collection('users');
        let doc = await userRef.doc(id).get();
        if (doc && doc.exists) {
            docUser = doc.data();
        }
    }else{
       docUser = {
            name: '',
            email: '',
            number: '',
        }
    }
    
    const inputName = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "",
        value: docUser.name
    });
    const inputTelephone = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "",
        mask: "(00)00000-0000",
        value: docUser.number
    });
    const inputEmail = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "",
        value: docUser.email
    });
    const confirmContact = Button(uniKey(), {
        classNameB: "button button-add",
        content: [Icon('check'), ' Adicionar contato'],
        click: (() => {
            var isValid = true
            let testeNumber = inputTelephone.value

            if (inputEmail.value == '' || inputName.value == '' || testeNumber.length != 14) {
                isValid = false;
            }
            if (isValid) {
                docUser = {
                    name: inputName.value,
                    email: inputEmail.value,
                    number: inputTelephone.value,
                    id: uniKey()
                }
                firestore.collection('users').doc(docUser.id).set(docUser)
                $.fancybox.close()
            }
        })
    })
    const deletContact = Button(uniKey(), {
        classNameB: "button-3",
        content: [Icon('user-times'), ' Remover contato'],
        click: (() => {
                firestore.collection('users').doc(docUser.id).delete().then(r => {
                    notifyMsg('success', 'Cliente excluido com sucesso.', { positionClass: "toast-bottom-right" });
                }).catch(e => {
                    console.log(e)
                    notifyMsg('error', 'Ocorreu um erro ao remover o cupom.', { positionClass: "toast-bottom-right" });
                })
            $.fancybox.close()
        })
    })
    const attContact = Button(uniKey(), {
        classNameB: "button",
        content: [Icon('check'), ' Atualizar contato'],
        click: (() => {
            var isValid = true
            let testeNumber = inputTelephone.value

            if (inputEmail.value == '' || inputName.value == '' || testeNumber.length != 14) {
                isValid = false;
            }
            if (isValid) {
                docUser = {
                    name: inputName.value,
                    email: inputEmail.value,
                    number: inputTelephone.value,
                    id: id
                }
                const elemento = document.getElementById(id);

                $(elemento).html([nText({ text: docUser.name }), nText({ text: docUser.email }),nText({ text: docUser.number }),])

                contacts[aux] = docUser;
                $.fancybox.close()//Fecha o modal
            }
        })
    })
    
    const cancelContact = Button(uniKey(), {
        classNameB: "cancel-button  button-add",
        content: [Icon('ban'), ' Cancelar'],
        click: (() => {
            $.fancybox.close()
        })
    })
    const buttonFinal = Section(uniKey(), { classNameB: "buttonFinal" });
    if (id != '') {
        $(buttonFinal).html([
            deletContact,
            ' ',
            attContact,
        ])
    } else {
        $(buttonFinal).html([
            cancelContact,
            ' ',
            confirmContact,
        ])
    }

    $("#modal-create-unique-content").html([
        nText({ text: "Clientes", classNameB: "title-modal" }),
        space(20),
        nText({ text: "Nome", classNameB: "subtitle-modal" }),
        inputName,
        space(10),
        nText({ text: "Telefone", classNameB: "subtitle-modal" }),
        inputTelephone,
        space(10),
        nText({ text: "Email", classNameB: "subtitle-modal" }),
        inputEmail,
        space(20),
        buttonFinal
    ])

}

const filter = (value) => {
    if (value == '') {
        for (var aux = 0; aux < contacts.length; aux++) {
            $("#" + contacts[aux].id).show();
        }
    }
    else {
        for (var aux = 0; aux < contacts.length; aux++) {
            if (contacts[aux].name.includes(value) || contacts[aux].email.includes(value)) {
                $("#" + contacts[aux].id).show();
            } else {
                var element = document.getElementById(contacts[aux].id);
                $("#" + contacts[aux].id).hide();
            }
        }
    }

}

const modalUniqueConsult = async (id = '') => {
    $("#modal-create-unique-content").html("")
    $.fancybox.open({ src: "#modal-create-unique", touch: false, keyboard: false });

    let docUser = {
        name: '',
        email: '',
        number: '',
    }
    var aux = 0
    for (; aux < contacts.length; aux++) {
        if (contacts[aux].id == id) {
            docUser = {
                name: contacts[aux].name,
                email: contacts[aux].email,
                number: contacts[aux].number,
            }
            break;
        }
    }
    const inputName = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "",
        value: docUser.name
    });
    const inputTelephone = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "",
        mask: "(00)00000-0000",
        value: docUser.number
    });
    const inputEmail = inputField(uniKey(), {
        classNameB: "input-field",
        placeholder: "",
        value: docUser.email
    });
    const confirmContact = Button(uniKey(), {
        classNameB: "button button-add",
        content: [Icon('check'), ' Adicionar contato'],
        click: (() => {
            var isValid = true
            let testeNumber = inputTelephone.value

            if (inputEmail.value == '' || inputName.value == '' || testeNumber.length != 14) {
                isValid = false;
            }
            if (isValid) {
                docUser = {
                    name: inputName.value,
                    email: inputEmail.value,
                    number: inputTelephone.value,
                    id: uniKey()
                }
                
                $.fancybox.close()
            }
        })
    })
    const deletContact = Button(uniKey(), {
        classNameB: "button-3",
        content: [Icon('user-times'), ' Remover contato'],
        click: (() => {
            contacts.splice(aux, 1);
            const elemento = document.getElementById(id);
            elemento.parentNode.removeChild(elemento);
            $(elemento).html('')
            $.fancybox.close()
        })
    })
    const attContact = Button(uniKey(), {
        classNameB: "button",
        content: [Icon('check'), ' Atualizar contato'],
        click: (() => {
            var isValid = true
            let testeNumber = inputTelephone.value

            if (inputEmail.value == '' || inputName.value == '' || testeNumber.length != 14) {
                isValid = false;
            }
            if (isValid) {
                docUser = {
                    name: inputName.value,
                    email: inputEmail.value,
                    number: inputTelephone.value,
                    id: id
                }
                const elemento = document.getElementById(id);

                $(elemento).html([nText({ text: docUser.name }), nText({ text: docUser.email }),nText({ text: docUser.number }),])

                contacts[aux] = docUser;
                $.fancybox.close()//Fecha o modal
            }
        })
    })
    const cancelContact = Button(uniKey(), {
        classNameB: "cancel-button  button-add",
        content: [Icon('ban'), ' Cancelar'],
        click: (() => {
            $.fancybox.close()
        })
    })
    const buttonFinal = Section(uniKey(), { classNameB: "buttonFinal" });
    if (id != '') {
        $(buttonFinal).html([
            deletContact,
            ' ',
            attContact,
        ])
    } else {
        $(buttonFinal).html([
            cancelContact,
            ' ',
            confirmContact,
        ])
    }

    $("#modal-create-unique-content").html([
        nText({ text: "Clientes", classNameB: "title-modal" }),
        space(20),
        nText({ text: "Nome", classNameB: "subtitle-modal" }),
        inputName,
        space(10),
        nText({ text: "Telefone", classNameB: "subtitle-modal" }),
        inputTelephone,
        space(10),
        nText({ text: "Email", classNameB: "subtitle-modal" }),
        inputEmail,
        space(20),
        buttonFinal
    ])

}