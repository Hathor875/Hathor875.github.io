document.addEventListener('DOMContentLoaded', function () {
    var cvForm = document.getElementById('cvForm');
    var optionalFieldsContainer = document.getElementById('additionalFields');
    var maxOptionalFields = 4;
    var colorPicker = document.getElementById('colorpicker');
    var elementsToColor = document.querySelectorAll('.colorable');
    var skillsListContainer = document.getElementById('skillsList');

    var photoInput = document.getElementById('photo');
    var cvPhoto = document.getElementById('cvPhoto');
    var workListContainer = document.getElementById('workList');

    photoInput.addEventListener('change', function () {
        displayUserPhoto();
        generateAndDisplayCV();
    });

    colorPicker.addEventListener('input', function () {
        updateAccentColor(colorPicker.value);
        generateAndDisplayCV();
    });

    generateAndDisplayCV();

    cvForm.addEventListener('input', function () {
        generateAndDisplayCV();
    });

    cvForm.addEventListener('submit', function (event) {
        event.preventDefault();
        generateAndDisplayCV();
    });

    document.getElementById('clearFormButton').addEventListener('click', function () {
        cvForm.reset();
        clearOptionalFields();
        displayUserPhoto();
        generateAndDisplayCV();
    });

    document.getElementById('addWorkExperienceButton').addEventListener('click', function () {
        var workName = document.getElementById('workName').value;
        var workDescription = document.getElementById('workDescription').value;
        var startDate = document.getElementById('startDate').value;
        var endDate = document.getElementById('endDate').value;

        addWorkExperience(workName, workDescription, startDate, endDate);

        // Clear input fields after adding work experience
        document.getElementById('workName').value = '';
        document.getElementById('workDescription').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
    });

    colorPicker.addEventListener('input', function () {
        updateAccentColor(colorPicker.value);
        generateAndDisplayCV();
    });

    function updateAccentColor(newColor) {
        elementsToColor.forEach(function (element) {
            element.style.color = newColor;
        });
    
        // Set background color for cvHeader
        var cvHeader = document.getElementById('cvHeader');
        if (cvHeader) {
            cvHeader.style.backgroundColor = newColor;
        }
    }

    function displayUserPhoto() {
        var file = photoInput.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                cvPhoto.src = e.target.result;
                cvPhoto.crossOrigin = "anonymous";
            };
            reader.readAsDataURL(file);
        } else {
            cvPhoto.src = '';
        }
    }

    function generateAndDisplayCV() {
        var description = document.getElementById('description').value;
        var cvDescriptionContent = document.getElementById('cvDescriptionContent');
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var phoneNumber = document.getElementById('phoneNumber').value || '';
        var email = document.getElementById('email').value || '';
        var cvNameElement = document.getElementById('cvName');
        var cvPhoneNumberElement = document.getElementById('cvPhoneNumber');
        var cvEmailElement = document.getElementById('cvEmail');

        cvNameElement.textContent = `${firstName} ${lastName}`;
        cvPhoneNumberElement.textContent = `Phone Number:\n${phoneNumber}`;
        cvEmailElement.textContent = `Email:\n${email}`;

        var optionalFields = document.querySelectorAll('.optional-field');
        var additionalFieldsData = '';

        optionalFields.forEach(function (field) {
            var fieldName = field.querySelector('.optional-field-name').value;
            var fieldValue = field.querySelector('.optional-field-value').value;
            if (fieldName && fieldValue) {
                additionalFieldsData += `${fieldName}: ${fieldValue}\n`;
            }
        });

        var generatedCV = generateCV(additionalFieldsData);

        var section1Content = generateSectionContent('section1Name', 'section1Description', 'colorable');
        generatedCV += section1Content;

        var section2Content = generateSectionContent('section2Name', 'section2Description', 'colorable');
        generatedCV += section2Content;

        var section3Content = generateSectionContent('section3Name', 'section3Description', 'colorable');
        generatedCV += section3Content;

        cvDescriptionContent.innerHTML = generatedCV;

        var additionalInfoContainer = document.getElementById('additionalInfo');
        additionalInfoContainer.textContent = additionalFieldsData;
    }

    function generateSectionContent(nameId, descriptionId, classToAdd) {
        var nameValue = document.getElementById(nameId).value;
        var descriptionValue = document.getElementById(descriptionId).value;

        return `<h2 class="${classToAdd}" style="text-align: center;">${nameValue}</h2>
                <p style="text-align: left;">${descriptionValue}</p>`;
    }

    function generateCV(additionalFieldsData) {
        var generatedCV = "";

        if (additionalFieldsData) {
            generatedCV += additionalFieldsData.replace(/\n/g, '<br><br>');
        }

        return generatedCV;
    }

    function addOptionalField() {
        if (optionalFieldsContainer.children.length < maxOptionalFields) {
            var newField = document.createElement('div');
            newField.classList.add('optional-field');

            newField.innerHTML = `
                <label for="optionalFieldName">Field Name:</label>
                <input type="text" class="optional-field-name">

                <label for="optionalFieldValue">Field Value:</label>
                <input type="text" class="optional-field-value">
                
                <button type="button" class="deleteOptionalFieldButton">Delete Field</button>
            `;

            optionalFieldsContainer.appendChild(newField);
            updateAddButtonState();
            generateAndDisplayCV();
        } else {
            alert('Maximum number of optional fields reached (4).');
        }
    }

    function clearOptionalFields() {
        optionalFieldsContainer.innerHTML = '';
    }

    var addOptionalFieldButton = document.getElementById('addOptionalFieldButton');
    addOptionalFieldButton.addEventListener('click', addOptionalField);

    optionalFieldsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('deleteOptionalFieldButton')) {
            event.target.parentElement.remove();
            updateAddButtonState();
            generateAndDisplayCV();
        }
    });

    function updateAddButtonState() {
        var addButton = document.getElementById('addOptionalFieldButton');
        addButton.disabled = optionalFieldsContainer.children.length >= maxOptionalFields;
    }

    var cvPhotoContainer = document.getElementById('cvPhotoContainer');

    document.getElementById('generateAndDownloadImageButton').addEventListener('click', function () {
        generateAndDownloadImage();
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
        workListContainer.appendChild(listItem);
        generateAndDisplayCV();
    }

    function generateAndDownloadImage() {
        var cvSection = document.querySelector('.cv-section');
        var cvPhoto = document.getElementById('cvPhoto');

        var isPhotoLoaded = cvPhoto.complete && cvPhoto.naturalHeight !== 0;

        if (!isPhotoLoaded) {
            cvPhoto.parentElement.removeChild(cvPhoto);
        }

        domtoimage.toPng(cvSection)
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'cv_image.png';
                link.click();
            })
            .catch(function (error) {
                console.error('Image generation error:', error);
            })
            .finally(function () {
                if (!isPhotoLoaded) {
                    cvPhotoContainer.appendChild(cvPhoto);
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
