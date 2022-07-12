
window.CmsBlock = function (runtime, element) {
    var loadCmsBlockHandlerUrl = runtime.handlerUrl(element, "load_cms_block");

    var notify;
    // The workbench doesn't support notifications.
    notify = typeof(runtime.notify) != 'undefined';
    
    var cmsHost = "";
  
    // Entry Variables
    var entry = {
      uid: null,
      slug: null,
      title: null,
      type: null,
      blockOder: [],
      enabledSections: []
    }

    // 1) Jquery select the course ---- filter
    $("#courseFilter").on("change", function () {
      var filter = this.value;
      update_entry_options(filter);
    });
  
    //select entry --> type , slug(requested value)
    $("#entry").on("change", function () {
      console.log('change entry:', this.value);
      var parts = this.value.split("::");
      var type = parts[0];
      var uid = parts[1];
      var request = {
        type: type,
        uid: uid
      };
  
      $.ajax({
        type: "POST",
        url: loadCmsBlockHandlerUrl,
        data: JSON.stringify(request),
        success: function (result) {
          cmsHost = result.cmsHost;

          // save local memory
          entry.uid             = uid;
          entry.type            = type;
          entry.slug            = result.entry.slug;
          entry.title           = result.entry.title;
          entry.blockOder       = [];
          entry.enabledSections = [];

          render_entry(type, result.entry);
        },
      });
    });
  
    update_entry_options = function (filter) {
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
            (elem.courseName.length > 0 && elem.courseName.includes(filter) != false )
          ) {
            var option = document.createElement("option");
  
            option.appendChild(document.createTextNode(elem.title));
            option.value = singularType + "::" + elem.uid;
  
            if (
              window.selectedEntry.uid != "" &&
              window.selectedEntry.uid == elem.uid &&
              window.selectedEntry.type != "" &&
              window.selectedEntry.type == singularType
            )
              option.selected = "selected";
  
            $("#" + typeKey + "Options").append(option);
          }
        });
      }
    };
  
    render_entry = function (type, entry) {
      switch (type) {
        case "clause":
          $("#generalView")
            .first()
            .html(
              renderField("contentBlock", entry) +
              renderField("clauseText", entry) +
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
          console.log('render unit:', entry);
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
      // [do not use .sortable callback, there is conflict with internal OpenEdx .sortable global fucntion]
      $('#generalView').sortable();
    };
  
    renderField = function (type, entry) {
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
              
              if( elem.cssClass == 'edx-academy-tip' )
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
              else if( elem.cssClass == 'edx-clause-tip')
              {
                base += "<div class=\"edx-clause-tip\">"
                elem.componentIcon.forEach(function(icon){
                  base += "<div class=\"edx-icon\">\
                    <img src=\"" + cmsHost + icon.url + "\" class=\"img-fluid\"/>\
                  </div>";
                })
                base += "<div class=\"edx-content\">" + elem.blockContent + "</div>\
                  </div>"
              }
              else if( elem.cssClass == 'edx-two-columns' )
              {
                base += "<div class=\"edx-two-columns\">"
                elem.componentIcon.forEach(function(icon){
                  base += "<div class=\"edx-icon\">\
                    <img src=\"" + cmsHost + icon.url + "\" class=\"img-fluid\"/>\
                  </div>";
                })
                base += "<div class=\"edx-content\">" + elem.blockContent + "</div>\
                  </div>"
              }
              else
              {
                base += "<div>";
                if (elem.blockTitle != null) 
                  base += "<h5>" + elem.blockTitle + "</h5>";
                base += "<div>" + elem.blockContent + "</div>" + "</div>";
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
                  "<h5>" + elem.assetTitle + "</h5>" +
                  "<div>" +
                  (typeof elem.assetType != "undefined" && (elem.assetType == "image" || elem.assetType == "icon")
                    ? '<img src="' +
                      cmsHost +
                      elem.assetfile[0].url +
                      '" class="img-fluid" />'
                    : elem.assetfile[0].url ) +
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

    $('#graphQlCmsXblock-save').on('click', function(event){
      
      // build block order 
      entry.blockOder = [];
      $("#generalView").find('li').each(function(index, node){
        entry.blockOder.push($(node).attr('data-id'));
      });

      var selection = $('#graphQlCmsXblock-form').serializeArray();
      entry.enabledSections = [];
      for( i in selection )
        entry.enabledSections.push(selection[i]['name']);

      if (notify) {
        runtime.notify('save', {state: 'start', message: "Saving"});
      }

      $.ajax({
        type: "POST",
        url: runtime.handlerUrl(element, "save_entry"),
        data: JSON.stringify(entry),
        success: function (result) {
          if (result['success'] && notify) {
            runtime.notify('save', {state: 'end'})
          }else{
            runtime.notify('error', {
              'title': 'Error saving CMS Block',
              'message': '@todo'
            });
          }
        }
      });

    });
  
    $(function ($) {
      /* Here's where you'd do things on page load. */
      update_entry_options($("#courseFilter").val()); 

      if ( window.selectedEntry.uid != "" && window.selectedEntry.type != "" )
      {
        entry.uid             = window.selectedEntry.uid;
        entry.slug            = window.selectedEntry.slug;
        entry.type            = window.selectedEntry.type;
        entry.blockOder       = window.selectedEntry.blockOder;
        entry.enabledSections = window.selectedEntry.enabledSections;
        entry.title           = window.selectedEntry.title;
      }

      if( entry.blockOder.length > 0 )
      {
        for( order in entry.blockOder )
        {
          var id = entry.blockOder[order];

          var listElement = $("#generalView").find('li');
          for( let pos = 0; pos < listElement.length; pos++ )
          {
            var node = listElement[pos];
            if( $(node).attr('data-id') == id )
            {
              // move down
              if( order > pos )
              {
                var shift = order - pos;
                while(shift > 0)
                {
                  var next = $(node).next();
                  $(node).insertAfter(next);
                  shift--;
                }
              }
              // move up
              else if( order < pos )
              {
                var shift = pos - order;
                while(shift > 0)
                {
                  var prev = $(node).prev();
                  $(node).insertBefore(prev);
                  shift--;
                }
              }
            }
          }
        }
      }

      // [do not use .sortable callback, there is conflict with internal OpenEdx .sortable global fucntion]
      $('#generalView').sortable();


      $('#graphQlCmsXblock-cancel').on('click', function() {
        if (notify) 
          runtime.notify('cancel', {});
      });

    });
};
  