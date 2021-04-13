"""
Graph QL XBlock to pull CMS content
"""
import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, String, List, Scope
from django.template import Context, Template
import requests
import re

class GraphQlCmsXBlock(XBlock):

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    clause = String(
        default=''
    )

    clauseSections = List(
        default=[]
    )

    cmsApi = 'https://dev.cms.intellcreative.ca/api'

    icon_class = 'other'

    def student_view(self, context=None):
        """
        The primary view of the GraphQL CMS XBlock, shown to students
        when viewing courses.
        """

        sections = []
        assets = []
        title = ''
        if self.clause is not '' :
            
            qlQueryBody = """ {
                title,
                ... on clauses_clause_Entry {
                    lmsText,
                    lmsAdvancedConcepts,
                    cmsAsset {
                        ... on cmsAsset_cmsAsset_BlockType {
                            id,
                            assetTitle,
                            assetType,
                            assetUsedFor,
                            assetfile  {
                                url
                            }
                        }
                    }
                } 
            } """
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"clauses\", slug: \"" + self.clause + "\" limit: 1) " + qlQueryBody + " }"
            })
            entry = resp.json()['data']['entries'][0]
            title = entry['title']

            if len(self.clauseSections) > 0 :
                for section in self.clauseSections : 
                    if section in entry :
                        sections.append(entry[section])
                    
                    elif '[' in section :
                        # Handle Array Items (Assets)
                        elemName = section.split('[')[0]
                        elemId = re.findall(r'\[.*?\]', section)[0].replace('[', '').replace(']', '')
                        if elemName in entry :
                            for subitem in entry[elemName] :
                                if subitem['id'] == elemId : 
                                    assets.append(subitem)

            else: 
                for section in entry :
                    if (type(entry[section])) == str:
                        sections.append(entry[section])
                    elif 'cmsAsset' in section :
                        for subitem in entry[section] :
                            assets.append(subitem)

        frag = Fragment()
        html = self.render_template("static/html/graphqlcmsxblock.html", {
            'self':  self, 
            'cmsHost': self.cmsApi.replace('/api', ''),
            'title': title,
            'sections': sections,
            'assets': assets
        })
        frag.add_content(html)
        frag.add_css(self.resource_string("static/css/graphqlcmsxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/graphqlcmsxblock.js"))
        frag.initialize_js('GraphQlCmsXBlock')
        return frag


    def studio_view(self, context=None):
        """
        The primary view of the LMS Admin - GraphQL CMS XBlock, shown to Autors
        """

        # Load Clauses (LMS Section detected)
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery {entries(section: \"clauses\") {slug, title} }"
        })
        clauses = resp.json()['data']['entries']
        clauses.sort(key=lambda x: x['title'], reverse=False)
        
        frag = Fragment()
        html = self.render_template("studio/html/cmsBlock.html", {
                'self': self,
                'clauses':  clauses
            })
        frag.add_content(html)
        frag.add_javascript(self.resource_string("studio/js/cmsBlock.js"))
        frag.initialize_js('CmsBlock')
        return frag


    def render_template(self, template_path, context={}):
        template_str = self.resource_string(template_path)
        template = Template(template_str)
        return template.render(Context(context))


    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    @XBlock.json_handler
    def select_cms_block(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """

        if 'clause' in data:
            self.clause = data['clause']
            self.clauseSections = []
            qlQueryBody = """ {
                slug,
                postDate,
                ... on clauses_clause_Entry {
                    lmsText,
                    lmsAdvancedConcepts,
                    cmsAsset {
                        ... on cmsAsset_cmsAsset_BlockType {
                            id,
                            assetTitle,
                            assetType,
                            assetUsedFor,
                            assetfile  {
                                url
                            }
                        }
                    }
                } 
            } """
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"clauses\", slug: \"" + self.clause + "\" limit: 10) " + qlQueryBody + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "clause": entry
            }

        return {}
    
    @XBlock.json_handler
    def select_cms_block_subsections(self, data, suffix=''):
        if 'type' in data:
            clauseSections = []
            for section in data['selected']: 
                clauseSections.append(section['name'])
            self.clauseSections = clauseSections
            return {'result': 'success', 'selected': self.clauseSections}
        
        return {}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("GraphQlCmsXBlock",
             """<graphqlcmsxblock/>
             """)
        ]
