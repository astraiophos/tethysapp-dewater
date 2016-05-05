from tethys_sdk.base import TethysAppBase, url_map_maker


class DewaterTool(TethysAppBase):
    """
    Tethys app class for Dewater Tool.
    """

    name = 'Dewater Tool'
    index = 'dewater:tool'
    icon = 'dewater/images/icon.gif'
    package = 'dewater'
    root_url = 'dewater'
    color = '#e74c3c'
    description = 'Model a simple dewatering scenario by using wells with a fixed pumping rate.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='tool',
                           url='dewater/tool',
                           controller='dewater.controllers.tool'),
                    UrlMap(name='license',
                           url='dewater/license',
                           controller='dewater.controllers.license'),
                    UrlMap(name='user',
                           url='dewater/user',
                           controller='dewater.controllers.user'),
                    UrlMap(name='tech',
                           url='dewater/tech',
                           controller='dewater.controllers.tech'),
        )

        return url_maps