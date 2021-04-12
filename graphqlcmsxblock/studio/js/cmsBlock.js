/* Javascript for MyXBlock. */
function CmsBlock(runtime, element) {

    var handlerUrl = runtime.handlerUrl(element, 'select_cms_block');
    var handlerSubSectionUrl = runtime.handlerUrl(element, 'select_cms_block_subsections');
    var cmsHost = ''

    $('#clause').on('change', function() {
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"clause": this.value}),
            success: function(result){
                cmsHost = result.cmsHost;
                $('#clauseView').first().html(
                    '<form id="clause" onChange="updateSelection(this)" onsubmit="javascript:void(0);" entry-type="clause">' + 
                        renderField('lmsText', result.clause) + 
                        renderField('lmsAdvancedConcepts', result.clause) + 
                        renderField('cmsAsset', result.clause) + 
                    '</form>'
                )
            }
        });
    });


    renderField = function(type, entry){
        if( typeof entry[type] == 'undefined' || entry[type] == ''  || entry[type] == null )
            return '';

        let base = '<div style="padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;">';
        switch(type){
            case 'lmsText':
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include LMS Text</label>';
                base += entry.lmsText;
                break;

            case 'lmsAdvancedConcepts':
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include LMS Advanced Concepts</label>';
                base += entry.lmsAdvancedConcepts
                break;

            case 'cmsAsset':
                entry.cmsAsset.forEach( function(elem){
                    if( typeof elem.assetfile[0] != 'undefined' ){
                        base += '<label><input type="checkbox" name="' + type + '[' + elem.id + ']" checked="checked"/> Include Asset</label>';
                        base += '<div>' + 
                            '<h5>' + elem.assetTitle +'</h5>' + 
                                '<div>' + ( typeof elem.assetType != 'undefined' && elem.assetType == 'image' ? 
                                    '<img src="' + cmsHost + elem.assetfile[0].url + '" class="img-fluid" />' : elem.assetfile[0].url ) + 
                                '</div>' + 
                            '</div>';
                    }
                })
                break;
        }
        base += '</div>';
        return base;
    };

    updateSelection = function(form){
        var selection = $(form).serializeArray()
        data = {
            'type': $(form).attr('entry-type'),
            'selected': selection
        }

        $.ajax({
            type: "POST",
            url: handlerSubSectionUrl,
            data: JSON.stringify(data),
            success: function(result){
                console.log(result)
            }
        });
    }

    $(function ($) {
        /* Here's where you'd do things on page load. */
        if( $('#clause').val() != ''  )
            $.ajax({
                type: "POST",
                url: handlerUrl,
                data: JSON.stringify({"clause": $('#clause').val() }),
                success: function(result){
                    cmsHost = result.cmsHost;
                    $('#clauseView').first().html(
                        '<form id="clause" onChange="updateSelection(this)" onsubmit="javascript:void(0);" entry-type="clause">' + 
                            renderField('lmsText', result.clause) + 
                            renderField('lmsAdvancedConcepts', result.clause) + 
                            renderField('cmsAsset', result.clause) + 
                        '</form>'
                    )
                }
            });
    });
}
