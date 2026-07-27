// projects.js

const ProjectsApp = {
  state: {
    hero: null,
    current: null,
    recommended: [],
    optional: [],
    completed: [],
    analytics: null,
    journey: null,
    insights: []
  },

  async init() {
    const root = document.getElementById('projects-app-root');
    if (!root) return;

    root.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--muted);">Loading AI Project Coach...</div>`;

    try {
      const data = await window.api('/api/projects/dashboard');
      if (data) {
        this.state.hero = data.heroRecommendation;
        this.state.current = data.currentProject;
        this.state.recommended = data.recommendedProjects || [];
        this.state.completed = data.completedProjects || [];
        this.state.optional = data.optionalProjects || [];
        this.state.analytics = data.analytics;
        this.state.journey = data.journey;
        this.state.insights = data.insights || [];
      }
      this.render();
    } catch (e) {
      console.error(e);
      root.innerHTML = `<div style="padding: 40px; text-align: center; color: #ff5555;">Failed to load project recommendations. Please try again.</div>`;
    }
  },

  render() {
    const root = document.getElementById('projects-app-root');
    if (!root) return;

    root.innerHTML = `
      <div class="projects-v2-container">
        ${this.renderHeroRecommendation()}
        ${this.renderAIInsights()}
        ${this.renderProjectJourney()}
        ${this.renderCurrentProject()}
        ${this.renderProjectAnalytics()}
        ${this.renderProjectGrid('Highly Recommended Projects', this.state.recommended)}
        ${this.renderProjectGrid('Completed Projects', this.state.completed, true)}
        ${this.renderProjectGrid('Optional Projects', this.state.optional)}
      </div>
      
      <!-- Modal Container -->
      <div id="project-modal" class="proj-modal-overlay"></div>
    `;

    this.attachEventListeners();
  },

  renderHeroRecommendation() {
    const p = this.state.hero;
    if (!p) return '';
    
    const rv = p.recruiter_value || { rating: '★★★★★', companies: [], skills: [], discussion_time: '' };

    return `
      <div class="proj-hero-card glass hover-lift">
        <div class="proj-hero-badge">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2H8a2 2 0 0 1-2-2v-2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2h4z"/></svg>
          AI Recommended Project
        </div>
        
        <div class="proj-hero-content">
          <div class="proj-hero-info">
            <h1 class="proj-title">${window.esc(p.title)}</h1>
            <p class="proj-reason">"Because you completed your recent track, this is the perfect next step to strengthen your portfolio."</p>
            
            <div class="proj-metrics">
              <div class="metric">
                <div class="m-val highlight-orange">${p.computed_match_score || 95}%</div>
                <div class="m-lbl">Match Score</div>
              </div>
              <div class="metric">
                <div class="m-val">${window.esc(p.difficulty)}</div>
                <div class="m-lbl">Difficulty</div>
              </div>
              <div class="metric">
                <div class="m-val">~${p.estimated_hours || 24} hrs</div>
                <div class="m-lbl">Est. Time</div>
              </div>
            </div>
            
            <div class="recruiter-value-box">
              <div class="rv-title">
                Why Recruiters Care
                <span>${window.esc(rv.rating)}</span>
              </div>
              <div class="rv-grid">
                <div class="rv-section">
                  <h5>Companies that value this</h5>
                  <ul>
                    ${(rv.companies || []).map(c => `<li>${window.esc(c)}</li>`).join('')}
                  </ul>
                </div>
                <div class="rv-section">
                  <h5>Skills Demonstrated</h5>
                  <ul>
                    ${(rv.skills || []).map(s => `<li>${window.esc(s)}</li>`).join('')}
                  </ul>
                  <div style="margin-top:12px; font-size:13px; color:#FF6B00;">
                    Typical Interview Discussion: ${window.esc(rv.discussion_time)}
                  </div>
                </div>
              </div>
            </div>

            <div class="proj-actions">
              <button class="btn btn-primary start-btn" data-id="${p.id}">Start Project</button>
              <button class="btn btn-outline view-details-btn" data-id="${p.id}">View Details</button>
            </div>
          </div>
          
          <div style="flex:1;">
             <div class="p-thumb" style="height:300px; border-radius:16px; background-image:url('${p.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600'}');"></div>
          </div>
        </div>
      </div>
    `;
  },

  renderAIInsights() {
    if (!this.state.insights || !this.state.insights.length) return '';
    return `
      <div class="insights-box">
        <h3><svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> AI Portfolio Insights</h3>
        ${this.state.insights.map(i => `
          <div class="insight-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            ${window.esc(i)}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderProjectJourney() {
    if (!this.state.journey || !this.state.journey.milestones) return '';
    return `
      <div>
        <h3 class="section-title">Your Project Journey</h3>
        <div class="journey-container">
          ${this.state.journey.milestones.map((m, idx) => `
            <div class="journey-node ${m.done ? 'done' : ''} ${!m.done && idx > 0 && this.state.journey.milestones[idx-1].done ? 'active' : ''}">
              <div class="node-circle">
                ${m.done ? '✓' : idx + 1}
              </div>
              <div class="node-label">${window.esc(m.name)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderCurrentProject() {
    const c = this.state.current;
    if (!c) {
      return `
        <div class="glass" style="padding: 24px; text-align: center; color: var(--muted); margin-bottom: 48px;">
          You haven't started your recommended project yet. Pick one below to begin!
        </div>
      `;
    }
    
    const p = c.project;
    return `
      <div class="active-proj-card glass" style="padding:32px; margin-bottom:48px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="color:#FF6B00; font-weight:700; font-size:14px; text-transform:uppercase; margin-bottom:8px;">Currently Building</div>
            <h2 style="font-size:24px; font-weight:700; margin-bottom:12px;">${window.esc(p.title)}</h2>
            <p style="color:#a0a0a0;">Milestone: ${window.esc(c.milestone)}</p>
            <div style="margin-top:24px;">
              ${c.github_url 
                ? `<a href="${window.esc(c.github_url)}" target="_blank" class="btn btn-outline">View Repository</a>`
                : `<button class="btn btn-primary submit-github-btn" data-id="${p.id}">Submit GitHub Repo</button>`
              }
            </div>
          </div>
          
          <div class="progress-ring-container">
            <svg class="progress-ring" width="120" height="120">
              <circle class="progress-ring__circle bg" stroke="rgba(255,255,255,0.1)" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
              <circle class="progress-ring__circle fg" stroke="#FF6B00" stroke-width="8" stroke-dasharray="326.7" stroke-dashoffset="${326.7 - (326.7 * c.progress / 100)}" fill="transparent" r="52" cx="60" cy="60"/>
            </svg>
            <div class="progress-text" style="font-size:24px;">${c.progress}%</div>
          </div>
        </div>
      </div>
    `;
  },

  renderProjectAnalytics() {
    const s = this.state.analytics;
    if (!s) return '';
    return `
      <div>
        <h3 class="section-title">Project Analytics</h3>
        <div class="analytics-grid">
          <div class="stat-card glass">
            <div class="stat-val">${s.completed}</div>
            <div class="stat-lbl">Projects Completed</div>
          </div>
          <div class="stat-card glass">
            <div class="stat-val">${s.remaining}</div>
            <div class="stat-lbl">Projects Remaining</div>
          </div>
          <div class="stat-card glass">
            <div class="stat-val">${s.portfolio_strength}</div>
            <div class="stat-lbl">Portfolio Strength</div>
          </div>
          <div class="stat-card glass">
            <div class="stat-val" style="font-size:20px; line-height:38px;">${window.esc(s.career_readiness)}</div>
            <div class="stat-lbl">Career Readiness</div>
          </div>
        </div>
      </div>
    `;
  },

  renderProjectGrid(title, projects, isCompleted = false) {
    if (!projects || projects.length === 0) return '';
    return `
      <div class="proj-grid-section">
        <h3 class="section-title">${title}</h3>
        <div class="premium-grid">
          ${projects.map(p => {
            const rv = p.recruiter_value || { rating: '★★★★★' };
            return `
            <div class="project-card premium-card glass hover-lift">
              <div class="p-thumb" style="background-image: url('${p.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400'}')"></div>
              <div class="p-content">
                <h4>${window.esc(p.title)}</h4>
                <div class="pmeta">
                  ${p.difficulty ? `<span class="chip chip-diff">${window.esc(p.difficulty)}</span>` : ''}
                  ${p.computed_match_score ? `<span class="chip chip-match highlight-orange">${p.computed_match_score}% Match</span>` : ''}
                  <span class="chip" style="color:#FF6B00;">${window.esc(rv.rating)} Recruiter Value</span>
                </div>
                <p class="p-desc">${window.esc(p.description || '').substring(0, 120)}...</p>
                <div class="p-actions" style="margin-top:auto; padding-top:16px;">
                  <button class="btn btn-outline btn-sm view-details-btn" style="width:100%" data-id="${p.id}">View Details</button>
                </div>
              </div>
            </div>
          `}).join('')}
        </div>
      </div>
    `;
  },

  renderProjectModal(id) {
    const all = [this.state.hero, ...this.state.recommended, ...this.state.completed, ...this.state.optional].filter(Boolean);
    const p = all.find(x => x.id === id);
    if (!p) return;

    const m = document.getElementById('project-modal');
    m.innerHTML = `
      <div class="proj-modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-header-img" style="background-image:url('${p.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200'}');"></div>
        <div class="modal-body">
          <h2 style="font-size:32px; font-weight:800; margin-bottom:16px;">${window.esc(p.title)}</h2>
          <p style="font-size:16px; color:#a0a0a0; margin-bottom:32px; line-height:1.6;">${window.esc(p.description)}</p>
          
          <div class="modal-grid">
            <div>
              <div class="m-section">
                <h3>After completing this project</h3>
                <ul>
                  <li>✓ Portfolio Ready</li>
                  <li>✓ Resume Ready</li>
                  <li>✓ GitHub Ready</li>
                  <li>✓ Deployable</li>
                  <li>✓ Interview Ready</li>
                </ul>
              </div>
              
              <div class="m-section">
                <h3>Features to Build</h3>
                <ul>
                  ${(p.features_to_build || ["User Authentication", "Dashboard", "Responsive UI"]).map(f => `<li>${window.esc(f)}</li>`).join('')}
                </ul>
              </div>

              <div class="m-section">
                <h3>Resume Bullet Example</h3>
                <p style="background:rgba(255,107,0,0.1); padding:16px; border-radius:8px; border-left:3px solid #FF6B00;">
                  "${window.esc(p.resume_bullet_example)}"
                </p>
              </div>
              
              <div class="m-section">
                <h3>Interview Questions</h3>
                <ul>
                  ${(p.interview_questions || []).map(q => `<li>${window.esc(q)}</li>`).join('')}
                </ul>
              </div>
            </div>
            
            <div>
              <div class="m-section">
                <h3>Technologies</h3>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  ${(p.technologies || ["HTML", "CSS", "JS"]).map(t => `<span class="chip" style="background:#222;">${window.esc(t)}</span>`).join('')}
                </div>
              </div>
              
              <div class="m-section">
                <h3>Project Score</h3>
                <div style="margin-bottom:12px;">Resume Impact: <strong class="highlight-orange">95/100</strong></div>
                <div style="margin-bottom:12px;">Portfolio Impact: <strong class="highlight-orange">90/100</strong></div>
                <div style="margin-bottom:12px;">Interview Freq: <strong class="highlight-orange">High</strong></div>
                <div style="margin-bottom:12px;">Industry Demand: <strong class="highlight-orange">Very High</strong></div>
              </div>
              
              ${!this.state.completed.find(x => x.id === p.id) ? `
                <div style="margin-top:40px;">
                  <button class="btn btn-primary start-btn" data-id="${p.id}" style="width:100%; padding:16px;">Start Building Project</button>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    
    m.classList.add('open');
    
    m.querySelector('.modal-close').addEventListener('click', () => {
      m.classList.remove('open');
    });
    
    const startBtn = m.querySelector('.start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
         this.startProject(e.target.dataset.id);
         m.classList.remove('open');
      });
    }
  },

  async startProject(id) {
    if (!confirm('Are you sure you want to start this project?')) return;
    try {
      const res = await window.api('/api/submit-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: id, github_url: 'https://github.com/placeholder/repo' })
      });
      if (res.success) {
        alert('Project started! Added to your current build queue.');
        this.init(); // Refresh dashboard
      } else {
        alert(res.error || 'Failed to start project');
      }
    } catch(e) {
      alert('Error starting project');
    }
  },

  attachEventListeners() {
    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.renderProjectModal(e.target.dataset.id);
      });
    });

    document.querySelectorAll('.start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.startProject(e.target.dataset.id);
      });
    });
  }
};

// Initialize when the tab is clicked or page loads
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[data-target="projects"]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (!ProjectsApp.state.hero) {
        ProjectsApp.init();
      }
    });
  });
});
