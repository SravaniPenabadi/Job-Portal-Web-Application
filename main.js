
        let jobs = [
            {
                id: 1,
                title: "Senior Frontend Developer",
                company: "TechCorp Inc.",
                location: "San Francisco",
                type: "Full-time",
                salary: "$90,000 - $120,000",
                skills: ["JavaScript", "React", "TypeScript"],
                description: "We are looking for a talented Senior Frontend Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern JavaScript frameworks. The ideal candidate should have strong experience with React, TypeScript, and modern development practices.",
                datePosted: new Date('2024-01-15'),
                applications: []
            },
            {
                id: 2,
                title: "Product Manager",
                company: "StartupXYZ",
                location: "New York",
                type: "Full-time",
                salary: "$100,000 - $130,000",
                skills: ["Product Strategy", "Analytics", "Leadership"],
                description: "Join our growing startup as a Product Manager and help shape the future of our innovative products. You'll work closely with engineering, design, and business teams to define product requirements and drive execution. Experience with agile methodologies and user research is preferred.",
                datePosted: new Date('2024-01-10'),
                applications: []
            },
            {
                id: 3,
                title: "UX Designer",
                company: "Design Studio",
                location: "Remote",
                type: "Remote",
                salary: "$70,000 - $95,000",
                skills: ["Figma", "User Research", "Prototyping"],
                description: "We're seeking a creative UX Designer to create intuitive and engaging user experiences. You'll conduct user research, create wireframes and prototypes, and work closely with developers to implement designs. Strong portfolio demonstrating user-centered design approach required.",
                datePosted: new Date('2024-01-20'),
                applications: []
            }
        ];

        let currentUser = { role: 'seeker', isLoggedIn: false };
        let editingJobId = null;
        let filteredJobs = [...jobs];
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            bindEvents();
            renderJobs();
            updateStats();
        });

        function initializeApp() {
            const roleSelector = document.getElementById('roleSelector');
            roleSelector.addEventListener('change', function() {
                currentUser.role = this.value;
                toggleRecruiterPanel();
                renderJobs();
            });
        }

        function bindEvents() {
            document.getElementById('searchInput').addEventListener('input', filterJobs);
            document.getElementById('typeFilter').addEventListener('change', filterJobs);
            document.getElementById('locationFilter').addEventListener('change', filterJobs);
            document.getElementById('sortSelect').addEventListener('change', sortJobs);

            document.getElementById('addJobBtn').addEventListener('click', () => openJobModal());
            document.getElementById('jobForm').addEventListener('submit', handleJobSubmit);
            document.getElementById('loginBtn').addEventListener('click', toggleLogin);
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    closeModal(e.target.id);
                }
            });
        }

        function toggleLogin() {
            currentUser.isLoggedIn = !currentUser.isLoggedIn;
            const loginBtn = document.getElementById('loginBtn');
            loginBtn.textContent = currentUser.isLoggedIn ? 'Logout' : 'Login';
            renderJobs();
        }

        function toggleRecruiterPanel() {
            const panel = document.getElementById('recruiterPanel');
            panel.style.display = currentUser.role === 'recruiter' ? 'block' : 'none';
        }

        function openJobModal(jobId = null) {
            const job = jobId ? jobs.find(j => j.id === jobId) : null;
            editingJobId = job ? job.id : null;
            const modal = document.getElementById('jobModal');
            const title = document.getElementById('modalTitle');
            
            title.textContent = job ? 'Edit Job' : 'Add New Job';
            
            if (job) {
                document.getElementById('jobTitle').value = job.title;
                document.getElementById('jobCompany').value = job.company;
                document.getElementById('jobLocation').value = job.location;
                document.getElementById('jobType').value = job.type;
                document.getElementById('jobSalary').value = job.salary;
                document.getElementById('jobSkills').value = job.skills.join(', ');
                document.getElementById('jobDescription').value = job.description;
            } else {
                document.getElementById('jobForm').reset();
            }
            
            modal.style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function handleJobSubmit(e) {
            e.preventDefault();
            
            const jobData = {
                title: document.getElementById('jobTitle').value,
                company: document.getElementById('jobCompany').value,
                location: document.getElementById('jobLocation').value,
                type: document.getElementById('jobType').value,
                salary: document.getElementById('jobSalary').value,
                skills: document.getElementById('jobSkills').value.split(',').map(s => s.trim()).filter(s => s),
                description: document.getElementById('jobDescription').value,
                datePosted: new Date(),
                applications: []
            };

            if (editingJobId) {
                const index = jobs.findIndex(j => j.id === editingJobId);
                jobs[index] = { ...jobs[index], ...jobData };
            } else {
                jobData.id = Date.now();
                jobs.unshift(jobData);
            }

            closeModal('jobModal');
            filterJobs();
            updateStats();
        }

        function deleteJob(id) {
            if (confirm('Are you sure you want to delete this job?')) {
                jobs = jobs.filter(job => job.id !== id);
                filterJobs();
                updateStats();
            }
        }

        function applyToJob(jobId) {
            if (!currentUser.isLoggedIn) {
                alert('Please login to apply for jobs');
                return;
            }

            const job = jobs.find(j => j.id === jobId);
            if (job) {
                const application = {
                    id: Date.now(),
                    applicantName: 'John Doe',
                    email: 'john@example.com',
                    appliedDate: new Date(),
                    status: 'Applied'
                };
                job.applications.push(application);
                renderJobs();
                updateStats();
                alert('Application submitted successfully!');
            }
        }

        function showJobDetail(jobId) {
            const job = jobs.find(j => j.id === jobId);
            if (!job) return;
            
            const modal = document.getElementById('detailModal');
            const content = document.getElementById('jobDetailContent');
            
            const hasApplied = job.applications.some(app => app.applicantName === 'John Doe');
            
            content.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #667eea; margin-bottom: 10px;">${job.title}</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 5px;"><strong>${job.company}</strong></p>
                    <p style="color: #666; margin-bottom: 15px;">${job.location} • ${job.type}</p>
                    <p style="font-size: 1.2rem; font-weight: bold; color: #4CAF50; margin-bottom: 15px;">${job.salary}</p>
                    
                    ${job.skills.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <strong>Required Skills:</strong>
                            <div style="margin-top: 8px;">
                                ${job.skills.map(skill => `<span class="job-tag">${skill}</span>`).join(' ')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="margin-bottom: 20px;">
                        <strong>Job Description:</strong>
                        <p style="margin-top: 8px; line-height: 1.6; color: #555;">${job.description}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <small style="color: #666;">Posted on: ${job.datePosted.toLocaleDateString()}</small>
                    </div>
                    
                    ${currentUser.role === 'seeker' ? `
                        ${hasApplied ? 
                            '<span class="application-status">✓ Applied</span>' : 
                            `<button class="btn btn-primary" onclick="applyToJob(${job.id})">Apply Now</button>`
                        }
                    ` : `
                        <div style="background: #f8f9ff; padding: 15px; border-radius: 10px;">
                            <strong>Applications: ${job.applications.length}</strong>
                            ${job.applications.length > 0 ? `
                                <div style="margin-top: 10px;">
                                    ${job.applications.map(app => `
                                        <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                            <strong>${app.applicantName}</strong> - ${app.email}
                                            <small style="color: #666; margin-left: 10px;">Applied: ${app.appliedDate.toLocaleDateString()}</small>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `}
                </div>
            `;
            
            modal.style.display = 'block';
        }

        function filterJobs() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const typeFilter = document.getElementById('typeFilter').value;
            const locationFilter = document.getElementById('locationFilter').value;

            filteredJobs = jobs.filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                                    job.company.toLowerCase().includes(searchTerm) ||
                                    job.skills.some(skill => skill.toLowerCase().includes(searchTerm));
                
                const matchesType = !typeFilter || job.type === typeFilter;
                const matchesLocation = !locationFilter || job.location === locationFilter;

                return matchesSearch && matchesType && matchesLocation;
            });

            sortJobs();
        }

        function sortJobs() {
            const sortBy = document.getElementById('sortSelect').value;

            filteredJobs.sort((a, b) => {
                switch (sortBy) {
                    case 'date-desc':
                        return new Date(b.datePosted) - new Date(a.datePosted);
                    case 'date-asc':
                        return new Date(a.datePosted) - new Date(b.datePosted);
                    case 'salary-desc':
                        return extractSalary(b.salary) - extractSalary(a.salary);
                    case 'salary-asc':
                        return extractSalary(a.salary) - extractSalary(b.salary);
                    default:
                        return 0;
                }
            });

            renderJobs();
        }

        function extractSalary(salaryString) {
            const match = salaryString.match(/\$?([\d,]+)/);
            return match ? parseInt(match[1].replace(',', '')) : 0;
        }

        function renderJobs() {
            const container = document.getElementById('jobsContainer');
            
            if (filteredJobs.length === 0) {
                container.innerHTML = `
                    <div class="no-jobs">
                        <h3>No jobs found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredJobs.map(job => {
                const hasApplied = job.applications.some(app => app.applicantName === 'John Doe');
                
                return `
                    <div class="job-card">
                        <h3 class="job-title">${job.title}</h3>
                        <div class="job-company">${job.company}</div>
                        <div class="job-details">
                            <span class="job-tag">${job.location}</span>
                            <span class="job-tag">${job.type}</span>
                        </div>
                        <div class="job-salary">${job.salary}</div>
                        ${job.skills.length > 0 ? `
                            <div class="job-details">
                                ${job.skills.slice(0, 3).map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                                ${job.skills.length > 3 ? `<span class="job-tag">+${job.skills.length - 3} more</span>` : ''}
                            </div>
                        ` : ''}
                        <div class="job-description">${job.description}</div>
                        <div class="job-actions">
                            <button class="btn btn-primary" data-job-id="${job.id}" onclick="window.showJobDetail(${job.id})">
                                View Details
                            </button>
                            ${currentUser.role === 'seeker' ? `
                                ${hasApplied ? 
                                    '<span class="application-status">✓ Applied</span>' : 
                                    `<button class="btn btn-success" onclick="window.applyToJob(${job.id})" ${!currentUser.isLoggedIn ? 'disabled' : ''}>
                                        ${!currentUser.isLoggedIn ? 'Login to Apply' : 'Apply Now'}
                                    </button>`
                                }
                            ` : `
                                <button class="btn btn-secondary" onclick="window.openJobModal(${job.id})">Edit</button>
                                <button class="btn btn-danger" onclick="window.deleteJob(${job.id})">Delete</button>
                                <small style="color: #666;">${job.applications.length} applications</small>
                            `}
                        </div>
                    </div>
                `;
            }).join('');
            addJobCardEventListeners();
        }

        function addJobCardEventListeners() {
            const viewButtons = document.querySelectorAll('[data-job-id]');
            viewButtons.forEach(button => {
                const jobId = parseInt(button.getAttribute('data-job-id'));
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    showJobDetail(jobId);
                });
            });
        }

        function updateStats() {
            document.getElementById('totalJobs').textContent = jobs.length;
            document.getElementById('totalApplications').textContent = 
                jobs.reduce((total, job) => total + job.applications.length, 0);
        }
        toggleRecruiterPanel();
