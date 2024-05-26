const continentSelect = document.querySelector('#continent-select');
const countries = document.querySelector('#countries-list');

// Fetch and display continents in the dropdown
queryFetch(`
  query {
    continents {
      name
      code
    }
  }
`).then(data => {
  data.data.continents.forEach(continent => {
    const option = document.createElement('option');
    option.value = continent.code;
    option.textContent = continent.name;
    continentSelect.appendChild(option);
  });
}).catch(error => {
  console.error('Error fetching continents:', error);
});

// Event listener for continent selection change
continentSelect.addEventListener('change', (e) => {
  queryFetch(`
    query {
      continent(code: "${e.target.value}") {
        countries {
          name
          code
        }
      }
    }
  `).then(data => {
    countries.innerHTML = '';
    data.data.continent.countries.forEach(country => {
      const li = document.createElement('li');
      li.textContent = country.name;
      countries.appendChild(li);
    });
  }).catch(error => {
    console.error('Error fetching countries:', error);
  });
});

// Function to fetch data using GraphQL query
function queryFetch(query) {
  return fetch('https://countries.trevorblades.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  .then(res => res.json())
  .catch(error => {
    console.error('Error in fetch:', error);
    throw error;  // Rethrow error to be caught in the caller
  });
}
