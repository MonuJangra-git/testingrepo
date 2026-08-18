FROM node:20-alpine
WORKDIR /app                         
COPY backend/package*.json ./         
RUN npm install --production        
COPY backend/ .                      
COPY frontend/ /frontend  
COPY backend/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
            
EXPOSE 5000
ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["node", "server.js"]             

