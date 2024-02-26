window.addEventListener("load", () => {
   document.querySelector("#search-form").addEventListener("submit", async (event) => {
      event.preventDefault();

      // Clear previous search results
      document.querySelector("#search_results_output").querySelectorAll("*").forEach(n => n.remove());

      // Get values from the form
      var page_size = document.querySelector("#size-select").value;
      var image_required = document.querySelector("#image_check").checked;
      var search_query = document.querySelector("#search_query").value;

      // Get handle to the hint messages
      const hint_page_size_selector = document.querySelector("#hint_page_size_selector");
      const hint_search_query = document.querySelector("#hint_search_query");

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
         // Hide the search form and show the loading view
         document.querySelector("#search-form").classList.remove("show-block");
         document.querySelector("#loading-view").classList.add("show-block");
         // Fetch the data from the API
         await fetch(`https://api.vam.ac.uk/v2/objects/search?q=${search_query}&page_size=${page_size}&data_profile=full&images_exist=${image_required}`)
            .then(async response => {
               if (response.ok) {
                  return await response.json();
               } else {
                  document.querySelector("#loading-view").classList.remove("show-block");
                  document.querySelector("#error-view").classList.add("show-block");
               }
            }).then(data => {
               const records_data = data.records;
               const search_results_output = document.querySelector("#search_results_output");
               if (records_data.length === 0) {
                  let div = document.createElement("div");
                  div.setAttribute("class", "record_display");

                  let h2 = document.createElement("h2");
                  h2.textContent = "No records found";
                  div.appendChild(h2);

                  let p = document.createElement("p");
                  p.textContent = "There are no records that match your search query";
                  div.appendChild(p);

                  search_results_output.appendChild(div);
               } else {
                  records_data.forEach(async record => {
                     let div = document.createElement("div");
                     div.setAttribute("class", "record_display");

                     let h2 = document.createElement("h2");
                     h2.textContent = `Record ${record.systemNumber}`;
                     div.appendChild(h2);

                     await fetch(record._images._primary_thumbnail)
                        .then(async response => {
                           if (response.ok) {
                              return await response.blob();
                           }
                        }).then(blob => {
                           let img = document.createElement("img");
                           img.src = URL.createObjectURL(blob);
                           img.alt = record._primaryTitle;
                           div.appendChild(img);
                           let imgLink = document.createElement("a");
                           imgLink.href = record._images._iiif_image_base_url + "/full/full/0/default.jpg";
                           imgLink.setAttribute("target", "_blank");
                           imgLink.setAttribute("rel", "noopener noreferrer");
                           imgLink.style.display = "block";
                           imgLink.textContent = "View full image";
                           div.appendChild(imgLink);
                        }).catch(error => {
                           let img_error = document.createElement("p");
                           img_error.textContent = "No image available";
                           div.appendChild(img_error);
                        });

                     let title_header = document.createElement("h3");
                     title_header.textContent = "Title:";
                     div.appendChild(title_header);
                     let title = document.createElement("p");
                     title.textContent = `${record._primaryTitle === '' ? "No title" : record._primaryTitle}`;
                     div.appendChild(title);

                     let date_header = document.createElement("h3");
                     date_header.textContent = "Date:";
                     div.appendChild(date_header);
                     let date = document.createElement("p");
                     date.textContent = `${record._primaryDate === '' ? "No date" : record._primaryDate}`;
                     div.appendChild(date);

                     let summary_description_header = document.createElement("h3");
                     summary_description_header.textContent = "Summary description:";
                     div.appendChild(summary_description_header);
                     let summary_description = document.createElement("p");
                     summary_description.textContent = `${record.summaryDescription === '' ? "No description available" : record.summaryDescription.replaceAll(/<[^>]*>?/gm, '')}`;
                     div.appendChild(summary_description);

                     search_results_output.appendChild(div);
                  });
               }
               document.querySelector("#loading-view").classList.remove("show-block");
               document.querySelector("#search-results").classList.add("show-block");
            }).catch(error => {
               document.querySelector("#loading-view").classList.remove("show-block");
               document.querySelector("#error-view").classList.add("show-block");
               console.error(error);
            });
      }
   });

   // Event listeners for the error view button to return to search screen
   document.querySelector("#try-again").addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#error-view").classList.remove("show-block");
      document.querySelector("#search-form").classList.add("show-block");
   });

   // Event listener search result screen to start another search
   document.querySelector("#back-to-search").addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#search_query").value = "";
      document.querySelector("#search-results").classList.remove("show-block");
      document.querySelector("#search-form").classList.add("show-block");
   });
});