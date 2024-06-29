1. bucket ('images') in supabase to store images, 'images_metadata' contains metadata about each image
2. to start the flask server, 
export $(cat .env | xargs)
python app.py

3. 
to start venv `python3 -m venv ../../venv`
to switch on venv `source ../../venv/bin/activate`

4. all pip install
pip install Flask
pip install Pillow
pip install torch
pip install requests
pip install psycopg2-binary
pip install python-dotenv
pip install numpy
pip install storage3

5. to leave venv: deactivate
6. npm install axios for frontend
7. src views admin default components

8. fetching changes
git remote add upstream https://github.com/main/repo.git (set repo as remote branch)
git fetch upstream  
git merge upstream/main