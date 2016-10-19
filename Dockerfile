FROM myong/services:0.0

MAINTAINER M Yong <m.yong@imperial.ac.uk>

RUN rm -rf /var/www/html
RUN rm -rf /var/www/scripts
RUN rm -rf /var/www/portal

COPY dist /var/www/portal
COPY src /var/www/
