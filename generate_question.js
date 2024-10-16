const generateQuestionUrl = "https://studybotapi.pythonanywhere.com/api/getQuestions";
const questionCharacterLengthLimit = 40;
const choicesCharacterLengthLimit = 9;
const withChoices = true;
let currentlyGeneratingQuestion = false;
const maxGenerationRetries = 5;


document.addEventListener('DOMContentLoaded', () => {

    const difficultyButtonWrapper = document.querySelector('.buttonWrapper:nth-child(1)');
    const quantityButtonWrapper = document.querySelector('.buttonWrapper:nth-child(2)');

    const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Random'];
    const quantityOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 5); // Creates [5, 10, 15, ..., 50]

    const difficultyDropdown = createDropdown(difficultyOptions, "difficultyValue");
    const quantityDropdown = createDropdown(quantityOptions.map(num => num.toString()), "quantityValue");

    difficultyButtonWrapper.appendChild(difficultyDropdown);
    quantityButtonWrapper.appendChild(quantityDropdown);

    const difficultyButton = difficultyButtonWrapper.querySelector('#difficultyDropdown');
    const quantityButton = quantityButtonWrapper.querySelector('#quantityDropdown');
    const generateButton = document.getElementById('generateButton');

    difficultyButton.addEventListener('click', () => {
        toggleDropdown(difficultyDropdown);
    });

    quantityButton.addEventListener('click', () => {
        toggleDropdown(quantityDropdown);
    });

    generateButton.addEventListener('click', async () => {
        const topicInput = document.getElementById('topicInput');
        const questionTopic = topicInput.value.trim();
        if (questionTopic === '') {
            alert('Please enter a topic before generating questions.');
            return;
        }

        if(currentlyGeneratingQuestion){
            alert("Already Generating, please wait!");
            return;
        }


        loadingSpinner.style.display = 'block';
        currentlyGeneratingQuestion = true;


        const difficultyInput = document.getElementById('difficultyValue');
        const quantityInput = document.getElementById('quantityValue');
        const descriptionInput = document.getElementById('optionalDescription')

        const questionAmount = quantityInput.textContent;
        const difficulty = difficultyInput.textContent;
        const optionalDescription = descriptionInput.value.trim();

        const queryParams = new URLSearchParams({
            topic: questionTopic,
            numberOfQuestions: parseInt(questionAmount),
            difficulty: difficulty,
            withChoices: withChoices,
            questionCharacterLimit: questionCharacterLengthLimit,
            choicesCharacterLimit: choicesCharacterLengthLimit,
            optionalDescription: optionalDescription
        });
        
        const urlWithParams = `${generateQuestionUrl}?${queryParams.toString()}`;
        for(let currentIteration = 0; currentIteration < maxGenerationRetries; currentIteration++){
            console.log(currentIteration);
            try {
                const response = await fetch(urlWithParams, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const jsonInput = await response.text();
                console.log(jsonInput);
                const data = JSON.parse(jsonInput);
                const newData = {"title": questionTopic, "questions": data}
                localStorage.setItem('generatedQuestionParams', JSON.stringify(newData));
                currentlyGeneratingQuestion = false;
                window.location.href = 'index.html';
                break;
    
            } catch (error) {
                if(currentIteration === maxGenerationRetries - 1){
                    alert('An error occurred while generating questions.');
                }
                currentlyGeneratingQuestion = false;
                continue;
            }
        }
        loadingSpinner.style.display = 'none';
        currentlyGeneratingQuestion = false;
    });
});

function createDropdown(options, buttonInput) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('dropdown-item');
        optionElement.textContent = option;

        optionElement.addEventListener('click', () => {
            const button = document.getElementById(buttonInput);
            button.textContent = option;
            dropdown.style.display = 'none';
        });

        dropdown.appendChild(optionElement);
    });

    dropdown.style.display = 'none'; // Initially hidden
    return dropdown;
}

function toggleDropdown(dropdown) {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('.buttonWrapper')) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => dropdown.style.display = 'none');
    }
});
