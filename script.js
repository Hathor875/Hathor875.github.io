document.addEventListener('DOMContentLoaded', function () {                     //dodanie "listenera" który po skończniu parsowania html wywoła funkcje"
    var cvForm = document.getElementById('cvForm');                             //zapisanie do zmiennej wyniku metody poszukjącej w HTML elementu cvForm
    var optionalFieldsContainer = document.getElementById('additionalFields'); 
    var maxOptionalFields = 4;                                                  //maksymalna ilość pół dodatkowych w CV
    var colorPicker = document.getElementById('colorpicker');                    
    var elementsToColor = document.querySelectorAll('.colorable');              //wyszukanie wszystkich elementów klasy .colorable i zapisanie ich listy
    var skillsListContainer = document.getElementById('skillsList');            

    var photoInput = document.getElementById('photo');
    var cvPhoto = document.getElementById('cvPhoto');
    var workListContainer = document.getElementById('workList');

    photoInput.addEventListener('change', function () {          //dodanie listenera do elementu photoInput na zdarzenie change (gdy watrtość elementu się zmieni i co ważne ELEMENT STRACI FOCUS )                         
        displayUserPhoto();                 //kod do wywołania po spełnienu warunków i wywołaniu listenera 
        generateAndDisplayCV();             //
    });

    colorPicker.addEventListener('input', function () {  // INPUT w przeciwieństwie do chagne nie musi tracić FOCUSU przez co bardziej nadaje się do np pół tesktowych
        updateAccentColor(colorPicker.value);
        generateAndDisplayCV();
    });

    generateAndDisplayCV();

    cvForm.addEventListener('input', function () {
        generateAndDisplayCV();
    });

    cvForm.addEventListener('submit', function (event) {  //wywołane gdy następuje próba przesłania formularza
        event.preventDefault();
        generateAndDisplayCV();
    });

    document.getElementById('clearFormButton').addEventListener('click', function () { // click czyli gdy element zostanie kliknięty przez użytkownika
        cvForm.reset();
        clearWorkFields();
        clearOptionalFields();
        displayUserPhoto();
        generateAndDisplayCV();
    });

    document.getElementById('addWorkExperienceButton').addEventListener('click', function () { // po klikniecu pobranie danych z wszystkich potrzebnych pól
        var workName = document.getElementById('workName').value;                             
        var workDescription = document.getElementById('workDescription').value;               
        var startDate = document.getElementById('startDate').value;
        var endDate = document.getElementById('endDate').value;

        addWorkExperience(workName, workDescription, startDate, endDate);        // i przekazanie ich do addWorkExperinece 

        document.getElementById('workName').value = '';
        document.getElementById('workDescription').value = '';       // po czym wyczyszczenie pół formularza 
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
    });

    colorPicker.addEventListener('input', function () {
        updateAccentColor(colorPicker.value);
        generateAndDisplayCV();
    });

    function updateAccentColor(newColor) {
        elementsToColor.forEach(function (element) { //iterowanie przez każdy element kolekcji elementsTpColor
            element.style.color = newColor; //ustawienie nowego koloru
        });
    
        
        var cvHeader = document.getElementById('cvHeader'); //zmiana koloru dla nagłówka generowanego CV
        if (cvHeader) {
            cvHeader.style.backgroundColor = newColor;
        }
    }

    function displayUserPhoto() {
        var file = photoInput.files[0]; //porbranie pierwszego elementu typu file o id "photoInput"

        if (file) {
            var reader = new FileReader(); // jeśli plik istnieje 
            reader.onload = function (e) {
                cvPhoto.src = e.target.result;  // ustawienie zródła obrazu na dane z pliku 
                cvPhoto.crossOrigin = "anonymous"; // crossOrgin na anonymous w celu uniknięcia problemów z CORS
            };
            reader.readAsDataURL(file); // rozpoczęcie odczytu pliku jako URL danych 
        } else {
            cvPhoto.src = ''; // jeśłi plik nie istnieje czyszczenie źródła obrazu (wymagane dla poprawnej pracy DOMtoPDF)
        }
    }

    function generateAndDisplayCV() {   
                //generowaie CV
        var description = document.getElementById('description').value;                     //odczytanie i zapisanie potrzbnych zmiennych
        var cvDescriptionContent = document.getElementById('cvDescriptionContent');
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var phoneNumber = document.getElementById('phoneNumber').value || '';
        var email = document.getElementById('email').value || '';
        var cvNameElement = document.getElementById('cvName');
        var cvPhoneNumberElement = document.getElementById('cvPhoneNumber');
        var cvEmailElement = document.getElementById('cvEmail');

        cvNameElement.textContent = `${firstName} ${lastName}`;                     //wpisanie danych co CV
        cvPhoneNumberElement.textContent = `Phone Number:\n${phoneNumber}`;
        cvEmailElement.textContent = `Email:\n${email}`;

        var optionalFields = document.querySelectorAll('.optional-field');  //znalezienie wszystkich elementów o klasie CSS .optional-field i zapisanie ich do kolekcji
        var additionalFieldsData = '';              //przygotowanie zmiennej dla przechowania danych z formularza

        optionalFields.forEach(function (field) {                                       //iteracja przez wszystkie oprionalFields 
            var fieldName = field.querySelector('.optional-field-name').value;         //pobranie wartości name 
            var fieldValue = field.querySelector('.optional-field-value').value;      // pobranie wartości value 
            if (fieldName && fieldValue) {                                           //sprawdznieie czy obie warotości są zdefiniowane 
                additionalFieldsData += `${fieldName}: ${fieldValue}\n`;            //jeśli tak dodanie ich do zmiennej additionalFieldsData 
            }
        });

        var generatedCV = generateCV(additionalFieldsData);  //wywołanie generateCV z agrumentem additionalFieldsData w celu wygenrowania potrzbnych pół 

        var section1Content = generateSectionContent('section1Name', 'section1Description', 'colorable'); // wywołanie funkcji generateSectionContent i zapisanie zwórconej wartości 
        generatedCV += section1Content;                 //dodatnie zwrócoenej wartości do generatedCV

        var section2Content = generateSectionContent('section2Name', 'section2Description', 'colorable');
        generatedCV += section2Content;

        var section3Content = generateSectionContent('section3Name', 'section3Description', 'colorable');
        generatedCV += section3Content;

        cvDescriptionContent.innerHTML = generatedCV;   //ustawienie zawartości cvDescriptionContent przez użycie innerHTML co pozwala na zastąpienie zawartości elementu na generatedCV

        var additionalInfoContainer = document.getElementById('additionalInfo');
        additionalInfoContainer.textContent = additionalFieldsData;
    }

    function generateSectionContent(nameId, descriptionId, classToAdd) {  //wygenerowanie fragmentu Section
        var nameValue = document.getElementById(nameId).value;
        var descriptionValue = document.getElementById(descriptionId).value;

        return `<h2 class="${classToAdd}" style="text-align: center;">${nameValue}</h2>
                <p style="text-align: left;">${descriptionValue}</p>`;
    }

    function generateCV(additionalFieldsData) {
        var generatedCV = "";
  
        
        // Sprawdzenie czy są jakieś dane dodatkowe 
        if (additionalFieldsData) {
            // dodaj je 
            // oraz zamień znaki nowej linii ('\n') na podwójne znaki nowej linii HTML ('<br><br>')
            generatedCV += additionalFieldsData.replace(/\n/g, '<br><br>');
        }

        return generatedCV;
    }

    function addOptionalField() {
        if (optionalFieldsContainer.children.length < maxOptionalFields) { // sprawdznie czy liczba dzieci w kontenerze opcjonalnych pól jest mniejsza niż maksymalna liczba
            var newField = document.createElement('div'); //nowy element div na dodatkowe dane 
            newField.classList.add('optional-field'); // dodanie klasy "optional-field" do nowego polsa


            //ustawienie treści nowego pola
            newField.innerHTML = `
                <label for="optionalFieldName">Field Name:</label>                  
                <input type="text" class="optional-field-name">

                <label for="optionalFieldValue">Field Value:</label>
                <input type="text" class="optional-field-value">
                
                <button type="button" class="deleteOptionalFieldButton">Delete Field</button>
            `;

            optionalFieldsContainer.appendChild(newField);  // dodanie nowego pola do kontenera opcjonalnych pól
            updateAddButtonState();  // wywołanie funkcji do aktualizacji stanu przycisku dodawania pola
            generateAndDisplayCV(); //wygenrowanie i wyświetlenie CV
        } else {
            alert('Maximum number of optional fields reached (4).'); //blokada i alert jeśli przekrocozno maksymalna ilość dodatkowych pól
        }
    }

    function clearOptionalFields() {                //przycisk czyszczenia opcjonalnych pól
        optionalFieldsContainer.innerHTML = '';
        
    }

    function clearWorkFields() {
      
        var workFields = document.querySelectorAll('.work-info');
            workFields.forEach(function (field) {
            field.innerHTML = '';
           
        });
        generateAndDisplayCV;
    }
    var addOptionalFieldButton = document.getElementById('addOptionalFieldButton');
    addOptionalFieldButton.addEventListener('click', addOptionalField);


    //funkcja do usunięcia dodatkowego pola 
    optionalFieldsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('deleteOptionalFieldButton')) {
            event.target.parentElement.remove(); //usniecie rodzica elementu wywołującego zdarznie 
            updateAddButtonState();
            generateAndDisplayCV();
        }
    });

    function updateAddButtonState() {
        var addButton = document.getElementById('addOptionalFieldButton');
        addButton.disabled = optionalFieldsContainer.children.length >= maxOptionalFields; //wyłączie przycisku jeśli maksymalna ilość pól została przekroczona 
    }

    var cvPhotoContainer = document.getElementById('cvPhotoContainer'); 

    document.getElementById('generateAndDownloadImageButton').addEventListener('click', function () { // przycisk do pobrania CV
        generateAndDownloadImage(); // wywołanie funkcji generowania i pobierania zdjęcia
    });

    function addWorkExperience(name, description, startDate, endDate) {
        var listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="bullet"></span>
            <div class="work-info">
                <h3>${name}</h3>
                <p>${description}</p>
                
                <p>${startDate} - ${endDate ? endDate : 'Present'}</p>  
            </div>
        `;
        //sprawdzenie czy endDate jest zdefinowane ,a jeśłi nie to używane jest "Present"
        workListContainer.appendChild(listItem); //dodanie właśnie stworzonego elementu do workListCOntainer
        generateAndDisplayCV();
    }

    function generateAndDownloadImage() {
        var cvSection = document.querySelector('.cv-section');
        var cvPhoto = document.getElementById('cvPhoto');

        var isPhotoLoaded = cvPhoto.complete && cvPhoto.naturalHeight !== 0; //weryfikacja czy obraz został poprawnie załadowany 
                                                                            //cvPhoto.complete == true jeśli obraz został załadowanych ,inaczej jest false 
                                                                            //cvPhoto.naturalHeight !== 0 sprawdzamy czy wysokość zdjęcia jest inna niż zero 

        if (!isPhotoLoaded) {
            cvPhoto.parentElement.removeChild(cvPhoto);  //usuwanie obrazu jeśli nie został poprawnie załadowany (potrzbne do poprawnego pobierania CV)
        }

        domtoimage.toPng(cvSection)
            .then(function (dataUrl) {
                //link do pobrania obrazu 
                var link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'cv_image.png';
                //uruchomienie pobierania
                link.click();
            })
            .catch(function (error) {
                console.error('Image generation error:', error);
            })
            .finally(function () {
                //sprawdznie czy zdjęcie jest załadowane 
                if (!isPhotoLoaded) {
                    cvPhotoContainer.appendChild(cvPhoto); //Jeśli nie , dodanie ponownie elementu <img> do jego kontenera
                } 
            });
    }

    function addSkill(skillName, skillRating) {
        var skillItem = document.createElement('div');
        skillItem.classList.add('skill-item');
        skillItem.innerHTML = `
            <span class="skill-name"><h1>${skillName}</h1></span>
            <div  class="skill-rating">${generateStarRating(skillRating)}</div>
        `;
        skillsListContainer.appendChild(skillItem);
        generateAndDisplayCV();
    }

    function generateStarRating(rating) {
        var stars = '';
        for (var i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '★'; // Pełna gwiazdka dla oceny 1 do 5
            } else {
                stars += '☆'; // Pusta gwiazdka dla oceny 0
            }
        }
        return stars;
    }

    var addSkillButton = document.getElementById('addSkillButton');
    addSkillButton.addEventListener('click', function () {
        var skillName = prompt('Enter skill name:');
        var skillRating = parseInt(prompt('Enter skill rating (0-5):')) || 0;

        if (skillName && !isNaN(skillRating) && skillRating >= 0 && skillRating <= 5) {
            addSkill(skillName, skillRating);
        } else {
            alert('Invalid input. Please enter valid skill name and rating.');
        }
    });

});
