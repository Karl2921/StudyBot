const addButton = document.getElementById('addQuestionList');
const container = document.getElementById('questionListsContainer');


async function loadQuestionLists() {
    fetch('https://studybotapi.pythonanywhere.com/getAllQuestionList')
        .then(response => response.text())  // Get the response as text
        .then(data => {
            try {
                const jsonData = JSON.parse(data);  // Parse the string to JSON
                console.log(jsonData);
                // Now you can use jsonData like a regular object
                jsonData.questionList.forEach(list => {
                    console.log('Title:', list.title);
                    console.log('Questions:', list.questions);
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to create a new question list
function createQuestionList(title, questions     = []) {
    const newQuestionListDiv = document.createElement('div');
    newQuestionListDiv.className = 'QuestionListDiv';
    newQuestionListDiv.setAttribute('drop-down', 'toggle-off');

    newQuestionListDiv.innerHTML = `
        <div style="display: flex; justify-content: space-evenly; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <button type="button" class="dropdown-button" style="border: none; background: none; padding: 0;">
                    <img class="DropLogo dropdown-icon" src="Images/down_logo.png" height="50" width="50" alt="Dropdown Logo" />
                </button>
                <input class="TextInputBox" type="text" placeholder="Type your question here..." />
                <button type="button" class="add-question-button" style="border: none; background: none; padding: 0;">
                    <img class="AddLogo" src="Images/add_logo.png" height="40" width="40" alt="Add Logo" />
                </button>
                <button type="button" class="trash-button" style="border: none; background: none; padding: 0;">
                    <img class="TrashLogo" src="Images/trash_can_logo.png" height="40" width="40" alt="Trash Logo" />
                </button>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                <button type="button" class="upload-button" style="border: none; background: none; padding: 0;">
                    <img class="UploadLogo" src="Images/upload_logo.png" height="40" width="40" alt="Upload Logo" />
                </button>
            </div>
        </div>
        <div class="dropdown-content" style="display: none; margin-top: 10px; text-align: center;">
            <div class="question-answer-row" style="display: flex; justify-content: center; align-items: center; gap: 20px; width: 100%;">
                <input class="QuestionInput" type="text" placeholder="Question" style="flex-grow: 2; min-width: 20px; max-width: 300px; margin: 5px;" />
                <input class="AnswerInput" type="text" placeholder="Answer" style="flex-grow: 2; min-width: 15px; max-width: 300px; margin: 5px;" />
                <button type="button" class="delete-question-button" style="border: none; background: none; padding: 0;">
                    <img class="TrashLogo" src="Images/trash_can_logo.png" height="20" width="20" alt="Delete Logo" />
                </button>
            </div>
        </div>
    `;

    container.appendChild(newQuestionListDiv);
    addEventListeners(newQuestionListDiv);
}

// Add event listeners for buttons in the question list
function addEventListeners(questionListDiv) {
    const dropdownButton = questionListDiv.querySelector('.dropdown-button');
    const deleteButton = questionListDiv.querySelector('.trash-button');
    const addQuestionButton = questionListDiv.querySelector('.add-question-button');

    dropdownButton.addEventListener('click', () => toggleDropdown(questionListDiv, dropdownButton));
    deleteButton.addEventListener('click', () => questionListDiv.remove());
    addQuestionButton.addEventListener('click', () => addQuestionRow(questionListDiv));
}

// Function to toggle dropdown visibility and change the icon
function toggleDropdown(questionListDiv, dropdownButton) {
    const dropdownContent = questionListDiv.querySelector('.dropdown-content');
    const dropdownIcon = dropdownButton.querySelector('.dropdown-icon');

    const isDisplayed = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isDisplayed ? 'none' : 'block';

    // Change the icon based on dropdown state
    dropdownIcon.src = isDisplayed ? 'Images/down_logo.png' : 'Images/up_logo.png'; // Change to up_logo.png when opened
}

// Function to delete a question-answer row
function deleteQuestionRow(row) {
    row.remove(); // Remove the specific question-answer row
}

// Function to add a new question-answer row
function addQuestionRow(questionListDiv) {
    const dropdownContent = questionListDiv.querySelector('.dropdown-content');
    const newRow = document.createElement('div');
    newRow.className = 'question-answer-row'; // Add class for easier reference
    newRow.style.display = 'flex';
    newRow.style.justifyContent = 'center';
    newRow.style.alignItems = 'center';
    newRow.style.gap = '20px';
    newRow.style.width = '100%';

    newRow.innerHTML = `
        <input class="QuestionInput" type="text" placeholder="Question" style="flex-grow: 2; min-width: 20px; max-width: 300px; margin: 5px;" />
        <input class="AnswerInput" type="text" placeholder="Answer" style="flex-grow: 2; min-width: 15px; max-width: 300px; margin: 5px;" />
        <button type="button" class="delete-question-button" style="border: none; background: none; padding: 0;">
            <img class="TrashLogo" src="Images/trash_can_logo.png" height="40" width="40" alt="Delete Logo" />
        </button>
    `;

    dropdownContent.appendChild(newRow);

    // Add event listener for the delete button in the new row
    const deleteButton = newRow.querySelector('.delete-question-button');
    deleteButton.addEventListener('click', () => deleteQuestionRow(newRow)); // Pass the newRow context
}

// Add event listener for the add question list button
addButton.addEventListener('click', createQuestionList);

// Load question lists when the page loads
loadQuestionLists();
