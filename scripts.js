window.addEventListener("load", () => {

   document.querySelector("#search-form").addEventListener("submit", async (event) => {
      event.preventDefault();

      document.querySelector("#search_results_output").querySelectorAll("*").forEach(n => n.remove());

      // Get values from the form
      var page_size = document.querySelector("#size-select").value;
      var search_query = document.querySelector("#search_query").value;
   
      // Get handle to the hint messages
      const hint_search_query = document.querySelector("#hint_search_query");
      const hint_page_size_selector = document.querySelector("#hint_page_size_selector");
   
      let fields_valid = true;
      // Check if the query input is valid
      if (search_query === "" || search_query.length < 0) {
         hint_search_query.classList.add("show-inline");
         fields_valid = false;
      } else {
         hint_search_query.classList.remove("show-inline");
      }
      // Check if the page size input is valid
      if (page_size === "" || page_size.length < 0) {
         hint_page_size_selector.classList.add("show-inline");
         fields_valid = false;
      } else {
         hint_page_size_selector.classList.remove("show-inline");
      }
      
      if (fields_valid) {
         document.querySelector("#search-form").classList.remove("show-block");
         document.querySelector("#loading-view").classList.add("show-block");
         await fetch(`https://api.vam.ac.uk/v2/objects/search?q=${search_query}&page_size=${page_size}&data_profile=full`)
            .then(async response => {
               if (response.ok) {
                  const response_data = await response.json();
                  const records_data = response_data.records;
                  records_data.forEach(record => {
                     const record_div = `
                        <div class="record_display">
                           <h2>Record ${record.systemNumber}</h2>
                           ${record._images._primary_thumbnail === undefined ? "<strong><p>No image available</p></strong>" : `<img src='${record._images._primary_thumbnail}' alt='${record._primaryTitle}'/>`}
                           <p><strong>Title:</strong> ${record._primaryTitle === '' ? "No title" : record._primaryTitle}</p>
                           <p><strong>Date:</strong> ${record._primaryDate === '' ? "No date" : record._primaryDate}</p>
                           <p><strong>Summary description:</strong> ${record.summaryDescription === '' ? "No description available" : record.summaryDescription}</p>             
                        </div>
                     `;
                     document.querySelector("#search_results_output").insertAdjacentHTML("afterbegin", record_div);
                  });
                  document.querySelector("#loading-view").classList.remove("show-block");
                  document.querySelector("#search-results").classList.add("show-block");
               } else {
                  document.querySelector("#loading-view").classList.remove("show-block");
                  document.querySelector("#error-view").classList.add("show-block");
               }
            }).catch(error => {
               document.querySelector("#loading-view").classList.remove("show-block");
               document.querySelector("#error-view").classList.add("show-block");
            });
      }
   });

   document.querySelector("#try-again").addEventListener("click", () => {
      document.querySelector("#error-view").classList.remove("show-block");
      document.querySelector("#search-form").classList.add("show-block");
   });

   document.querySelector("#back-to-search").addEventListener("click", () => {
      document.querySelector("#search_query").value = "";
      document.querySelector("#search-results").classList.remove("show-block");
      document.querySelector("#search-form").classList.add("show-block");
   });
});