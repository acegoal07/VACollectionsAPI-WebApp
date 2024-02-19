window.addEventListener("load", () => {

   document.querySelector("#search-form").addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get values from the form
      var search_query = document.querySelector("#search_query").value;
   
      // Get handle to the hint messages
      const hint_search_query = document.querySelector("#hint_search_query");
   
      let fields_valid = true;
   
      if (search_query === "" || search_query.length < 0) {
         hint_search_query.style.display = "inline";
         fields_valid = false;
      } else {
         hint_search_query.style.display = "none";
      }

      document.querySelector("#search-form").style.display = "none";
      document.querySelector("#loading-view").style.display = "block";
      
      if (fields_valid) {
         await fetch('https://api.vam.ac.uk/v2/objects/search?q=' + search_query)
            .then(async response => {
               if (response.ok) {
                  const response_data = await response.json();

                  console.log(response_data);
                  const records_data = response_data.records;
                  console.log(records_data[0]);
                  // loop through the records and display the results
                  records_data.forEach(record => {
                     const record_div = document.createElement("div");
                     record_div.classList.add("record");
                     record_div.innerHTML = `
                        <h2>Record ${record.systemNumber}</h2>
                        <p>Piece name: ${record._primaryTitle}</p>
                        <p>Maker: ${record._primaryMaker.name}</p>
                     `;
                     document.querySelector("#search-results").appendChild(record_div);
                  });

                  document.querySelector("#loading-view").style.display = "none";
                  document.querySelector("#search-results").style.display = "block";
               } else {
                  document.querySelector("#loading-view").style.display = "none";
                  document.querySelector("#error-view").style.display = "block";
               }
            }).catch(error => {
               document.querySelector("#loading-view").style.display = "none";
               document.querySelector("#error-view").style.display = "block";
            });
      }
   });

   document.querySelector("#try-again").addEventListener("click", () => {
      document.querySelector("#error-view").style.display = "none";
      document.querySelector("#search-form").style.display = "block";
   });

   document.querySelector("#back-to-search").addEventListener("click", () => {
      document.querySelector("#search-results").style.display = "none";
      document.querySelector("#search-form").style.display = "block";
   });
});