
window.CmsBlock = function (runtime, element) {
    var handlerUrl = runtime.handlerUrl(element, "select_cms_block");
    var handlerSubSectionUrl = runtime.handlerUrl(element, "select_cms_block_subsections");
    var handleReSortedDataUrl = runtime.handlerUrl(element, "sort_save");
    var cmsHost = "";
    var sortable = null;
  
    // 1) Jquery select the course ---- filter
    $("#courseFilter").on("change", function () {
      var filter = this.value;
      update_entry_options(filter);
    });
  
    //select entry --> type , slug(requested value)
    $("#entry").on("change", function () {
      var parts = this.value.split("::");
      var type = parts[0];
      var slug = parts[1];
      var request = {};
      request[type] = slug;
  
      $.ajax({
        type: "POST",
        url: handlerUrl,
        data: JSON.stringify(request),
        success: function (result) {
          cmsHost = result.cmsHost;
          render_entry(type, result.entry);
        },
      });
    });
  
    window.update_entry_options = function (filter) {
      const types = ["clauses", "courses", "sections", "units"];
      const singularTypes = ["clause", "course", "section", "unit"];
  
      // options available, selected -->  select entry on basis of selected course
      for (window.index in types) {
        var typeKey = types[index];
        var singularType = singularTypes[index];
  
        $("#" + typeKey + "Options").empty();
  
        window[typeKey].forEach(function (elem) {
          if (
            filter == "" ||
            (elem.coursetag.length > 0 && elem.coursetag[0].slug == filter)
          ) {
            var option = document.createElement("option");
  
            option.appendChild(document.createTextNode(elem.title));
            option.value = singularType + "::" + elem.slug;
  
            if (
              window.entrySlug != "" &&
              window.entrySlug == elem.slug &&
              window.entryType != "" &&
              window.entryType == singularType
            )
              option.selected = "selected";
  
            $("#" + typeKey + "Options").append(option);
          }
        });
      }
    };
  
    window.render_entry = function (type, entry) {
      switch (type) {
        case "clause":
          $("#generalView")
            .first()
            .html(
              renderField("clauseText", entry) +
              renderField("lmsText", entry) +
              renderField("lmsAdvancedConcepts", entry) +
              renderField("platformText", entry) +
              renderField("platformAdvancedConcepts", entry) +
              renderField("cmsAsset", entry) +
              renderField("faq", entry) +
              renderField("tip", entry) +
              renderField("table2colMatrix", entry) +
              renderField("table3colMatrix", entry) +
              renderField("table4colMatrix", entry) +
              renderField("table5colMatrix", entry) +
              renderField("accordionneo", entry)
            );
          break;
  
        case "course":
          $("#generalView")
            .first()
            .html(
              renderField("contentBlock", entry) +
              renderField("cmsAsset", entry) +
              renderField("faq", entry) +
              renderField("tip", entry) +
              renderField("table2colMatrix", entry) +
              renderField("table3colMatrix", entry) +
              renderField("table4colMatrix", entry) +
              renderField("table5colMatrix", entry) +
              renderField("accordionneo", entry)
            );
          break;
  
        case "section":
          $("#generalView")
            .first()
            .html(
              renderField("contentBlock", entry) +
              renderField("cmsAsset", entry) +
              renderField("faq", entry) +
              renderField("tip", entry) +
              renderField("table2colMatrix", entry) +
              renderField("table3colMatrix", entry) +
              renderField("table4colMatrix", entry) +
              renderField("table5colMatrix", entry) +
              renderField("accordionneo", entry)
            );
          break;
  
        case "unit":
          $("#generalView")
            .first()
            .html(
              renderField("contentBlock", entry) +
              renderField("cmsAsset", entry) +
              renderField("faq", entry) +
              renderField("tip", entry) +
              renderField("table2colMatrix", entry) +
              renderField("table3colMatrix", entry) +
              renderField("table4colMatrix", entry) +
              renderField("table5colMatrix", entry) +
              renderField("accordionneo", entry) 
            );
          break;
      }
      apply_entry_block_oder();
    };
  
    window.apply_entry_block_oder = function() {
      // sortablejs
      $('#generalView').sortable({
        animation: 200,
        store: {
          get: function (sortable) {
            return window.blockOder;
          },
          set: function (sortable) {
            $.ajax({
              type: "POST",
              url: handleReSortedDataUrl,
              data: JSON.stringify(sortable.toArray())
            });
          },
        },
      });
    }
  
    window.renderField = function (type, entry) {
      if (
        typeof entry[type] == "undefined" ||
        entry[type] == "" ||
        entry[type] == null
      )
        return "";
  
      // multiple block sections
      if( ['contentBlock', 'cmsAsset', 'faq', 'tip', 'accordionneo', 
        'table2colMatrix', 'table3colMatrix', 'table4colMatrix', 'table5colMatrix'].indexOf(type) != -1 )
      {
        let base = '';
        switch(type){
          case "contentBlock":
            entry.contentBlock.forEach(function (elem) {

            let identifier = type + '[' + elem.id + ']';
            base +=  "<li data-id=\"" + identifier + "\"> \
              <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
              <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Content Block</label>";
              
              if( elem.cssClass == null )
              {
                base += "<div>";
                if (elem.blockTitle != null) 
                  base += "<h5>" + elem.blockTitle + "</h5>";
                base += "<div>" + elem.blockContent + "</div>" + "</div>";
              }
              else if( elem.cssClass == 'edx-academy-tip' )
              {
                  base += "<div class=\"edx-academy-tip\">";
                  elem.componentIcon.forEach(function(icon){
                    base += "<div class=\"edx-icon\">\
                      <img src=\"" + cmsHost + icon.url + "\" class=\"img-fluid\"/>\
                    </div>";
                  })
                  base += "<div class=\"edx-content\">" + elem.blockContent + "</div>\
                    </div>";
              }
              else if( elem.cssClass == 'edx-featured-content' )
              {
                  base += "<div class=\"edx-featured-content\">";
                  elem.componentIcon.forEach(function(icon){
                    base += "<div class=\"edx-icon\">\
                      <img src=\"" + cmsHost + icon.url + "\" class=\"img-fluid\"/>\
                    </div>";
                  })
                  base += "<div class=\"edx-content\">" + elem.blockContent + "</div>\
                    </div>";
              }
              else if( elem.cssClass == 'edx-advanced-concept' )
              {
                base += "<div class=\"edx-advanced-concept\">\
                    <button class=\"edx-opener\">\
                        <span>Close</span>\
                        <em>Open</em>\
                    </button>\
                    <strong class=\"edx-heading\">Advanced Concept</strong>\
                    <div class=\"edx-content\">" + elem.blockContent  + "</div>\
                </div>";
              }
              base += '</div></li>';
            });
            break;
  
          case "cmsAsset":
            entry.cmsAsset.forEach(function (elem) {
              if (typeof elem.assetfile[0] != "undefined") {
  
                let identifier = type + '[' + elem.id + ']';
                base +=  "<li data-id=\"" + identifier + "\"> \
                  <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                  <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Asset</label>";
                  
                base +=
                  "<div>" +
                  "<h5>" +
                  elem.assetTitle +
                  "</h5>" +
                  "<div>" +
                  (typeof elem.assetType != "undefined" && elem.assetType == "image"
                    ? '<img src="' +
                      cmsHost +
                      elem.assetfile[0].url +
                      '" class="img-fluid" />'
                    : elem.assetfile[0].url) +
                  "</div>" +
                  "</div>";
  
                  base += '</div></li>';
              }
            });
            break;
  
          case "faq":
            entry.faq.forEach(function (elem) {

              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include FAQ</label>";

              base +=
                "<div>" +
                "<h5>" +
                elem.question +
                "</h5>" +
                "<div>" +
                elem.answer +
                "</div>" +
                "</div>";
  
                base += '</div></li>';
              });
            break;
  
          case "tip":
            entry.tip.forEach(function (elem) {
              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Tip</label>";

              base +=
                "<div>" +
                "<h5>" +
                elem.tipTitle +
                "</h5>" +
                "<div>" +
                elem.tipContent +
                "</div>" +
                "</div>";
  
                base += '</div></li>';
            });
            break;
  
          case "accordionneo":
            entry.accordionneo.forEach(function (elem) {
              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Accordion</label>";
              
              base += "<h5>" + elem.accordionTitle + "</h5>";
              
              elem.accordionmatrix.forEach(function (accordion) {
                base +=
                  "<details>" +
                    "<summary>" +
                      accordion.accordionblocktitle +
                    "</summary>" +
                    accordion.accordionblockcontent +
                  "</details>";
              });
  
              base += '</div></li>';
            });
            break;
  
          case "table2colMatrix":
            entry.table2colMatrix.forEach(function (elem) {
  
              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Table</label>";

              base += "<table>";
    
              var tableData = elem.table2col;
    
              if (elem.hasHeaderRow == "yes") {
                base +=
                  "<tr>" +
                  "<th>" +
                  tableData[0].col1 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col2 +
                  "</th>" +
                  "</tr>";
                tableData = elem.table2col.slice(1);
              }
    
              tableData.forEach(function (rows) {
                base +=
                  "<tr>" +
                  "<td>" +
                  rows.col1 +
                  "</td>" +
                  "<td>" +
                  rows.col2 +
                  "</td>" +
                  "</tr>";
              });
    
              base += "</table>";
  
              base += '</div></li>';
            });
            break;
      
          case "table3colMatrix":
            entry.table3colMatrix.forEach(function (elem) {
  
              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Table</label>";

              base += "<table>";
    
              var tableData = elem.table3col;
    
              if (elem.hasHeaderRow == "yes") {
                base +=
                  "<tr>" +
                  "<th>" +
                  tableData[0].col1 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col2 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col3 +
                  "</th>" +
                  "</tr>";
                tableData = elem.table3col.slice(1);
              }
    
              tableData.forEach(function (rows) {
                base +=
                  "<tr>" +
                  "<td>" +
                  rows.col1 +
                  "</td>" +
                  "<td>" +
                  rows.col2 +
                  "</td>" +
                  "<td>" +
                  rows.col3 +
                  "</td>";
                ("</tr>");
              });
    
              base += "</table>";
  
              base += '</div></li>';
            });
            break;
      
          case "table4colMatrix":
            entry.table4colMatrix.forEach(function (elem) {
              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Table</label>";

              base += "<table>";
    
              var tableData = elem.table4col;
    
              if (elem.hasHeaderRow == "yes") {
                base +=
                  "<tr>" +
                  "<th>" +
                  tableData[0].col1 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col2 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col3 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col4 +
                  "</th>" +
                  "</tr>";
                tableData = elem.table4col.slice(1);
              }
    
              tableData.forEach(function (rows) {
                base +=
                  "<tr>" +
                  "<td>" +
                  rows.col1 +
                  "</td>" +
                  "<td>" +
                  rows.col2 +
                  "</td>" +
                  "<td>" +
                  rows.col3 +
                  "</td>" +
                  "<td>" +
                  rows.col4 +
                  "</td>" +
                  "</tr>";
              });
    
              base += "</table>";
              
              base += '</div></li>';
            });
            break;
      
          case "table5colMatrix":
            entry.table5colMatrix.forEach(function (elem) {
  
              let identifier = type + '[' + elem.id + ']';
              base +=  "<li data-id=\"" + identifier + "\"> \
                <div style=\"padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;\">\
                <label><input type=\"checkbox\" name=\"" + identifier + "\" checked=\"checked\"/> Include Table</label>";
                
              base += "<table>";
    
              var tableData = elem.table5col;
    
              if (elem.hasHeaderRow == "yes") {
                base +=
                  "<tr>" +
                  "<th>" +
                  tableData[0].col1 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col2 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col3 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col4 +
                  "</th>" +
                  "<th>" +
                  tableData[0].col5 +
                  "</th>" +
                  "</tr>";
                tableData = elem.table5col.slice(1);
              }
    
              tableData.forEach(function (rows) {
                base +=
                  "<tr>" +
                  "<td>" +
                  rows.col1 +
                  "</td>" +
                  "<td>" +
                  rows.col2 +
                  "</td>" +
                  "<td>" +
                  rows.col3 +
                  "</td>" +
                  "<td>" +
                  rows.col4 +
                  "</td>" +
                  "<td>" +
                  rows.col5 +
                  "</td>" +
                  "</tr>";
              });
    
              base += "</table>";
  
              base += '</div></li>';
            });
            break;
      
        }
        return base;
      }
      
      // single block types
      let base = '<li data-id="' + type + '">' +
        '<div style="padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;">';
      
      switch (type) {
        case "clauseText":
          base +=
            '<label><input type="checkbox" name="' +
            type +
            '" checked="checked"/> Include Clause Text</label>';
          base += entry.clauseText;
          break;
  
        case "lmsText":
          base +=
            '<label><input type="checkbox" name="' +
            type +
            '" checked="checked"/> Include LMS Text</label>';
          base += entry.lmsText;
          break;
  
        case "lmsAdvancedConcepts":
          base +=
            '<label><input type="checkbox" name="' +
            type +
            '" checked="checked"/> Include LMS Advanced Concepts</label>';
          base += entry.lmsAdvancedConcepts;
          break;
  
        case "platformText":
          base +=
            '<label><input type="checkbox" name="' +
            type +
            '" checked="checked"/> Include Platform Text</label>';
          base += entry.platformText;
          break;
  
        case "platformAdvancedConcepts":
          base +=
            '<label><input type="checkbox" name="' +
            type +
            '" checked="checked"/> Include Platform Advanced Concepts</label>';
          base += entry.platformAdvancedConcepts;
          break; 
  
        default:
          base += '@todo: ' + type;
      }
  
      base += '</li>' ;
      base += "</div>";
      return base;
    };
  
    window.updateSelection = function (form) {
      var selection = $(form).serializeArray();
      var data = {
        type: $(form).attr("entry-type"),
        selected: selection,
      };
  
      $.ajax({
        type: "POST",
        url: handlerSubSectionUrl,
        data: JSON.stringify(data),
        success: function (result) {},
      });
    };
  
    $(function ($) {
      /* Here's where you'd do things on page load. */
      update_entry_options($("#courseFilter").val());
      apply_entry_block_oder();
    });
};
  