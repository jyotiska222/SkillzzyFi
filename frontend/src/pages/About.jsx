import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  TrendingUp, 
  BookOpen, 
  Globe, 
  Zap,
  Lock,
  Coins,
  ArrowRight,
  Star,
  Users,
  BarChart3
} from "lucide-react";

const About = () => {
  const stats = [
    { value: "500+", label: "Active Creators" },
    { value: "2,400+", label: "Courses Available" },
    { value: "15,000+", label: "Students Enrolled" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Security First",
      description: "All transactions are secured by blockchain technology with smart contract guarantees"
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Accessibility",
      description: "Democratizing education by making quality content available to everyone globally"
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Creator Empowerment",
      description: "Ensuring content creators receive fair compensation for their work"
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Lifelong Learning",
      description: "Promoting continuous skill development in an ever-changing world"
    }
  ];

  const features = [
    {
      title: "Decentralized Marketplace",
      description: "A peer-to-peer platform eliminating intermediaries and reducing costs",
      icon: <BarChart3 className="h-8 w-8" />
    },
    {
      title: "Smart Contract Payments",
      description: "Secure, transparent transactions with automated royalty distributions",
      icon: <Coins className="h-8 w-8" />
    },
    {
      title: "Dynamic Pricing",
      description: "Content value adjusts based on demand, quality, and market trends",
      icon: <TrendingUp className="h-8 w-8" />
    },
    {
      title: "Community Driven",
      description: "Built for creators, by creators with governance rights for active users",
      icon: <Users className="h-8 w-8" />
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-800/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-500/30">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              <span>Revolutionizing Education with Blockchain</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Skill Exchange</span> is Here
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              SkillzzyFi is a decentralized platform where knowledge meets opportunity, empowering creators and learners through blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/explore" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Explore Content
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/create" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300">
                Become a Creator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl transform -rotate-2"></div>
                <img 
                  src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Learning community" 
                  className="relative rounded-2xl shadow-xl w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To democratize education by creating a transparent, fair, and accessible marketplace for knowledge exchange. We believe that everyone should have the opportunity to learn and monetize their skills, regardless of their background or location.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                By leveraging blockchain technology, we're eliminating intermediaries and ensuring that content creators receive their fair share while learners get access to quality educational materials at reasonable prices.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Global Learning Community</h3>
                  <p className="text-gray-600">Connecting creators and learners worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do at SkillzzyFi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-blue-600 mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">How SkillzzyFi Works</h2>
            <p className="text-lg text-gray-600">A seamless process for creators and learners</p>
          </div>
          
          <div className="relative">
            <div className="absolute hidden lg:block left-1/2 top-1/2 transform -translate-y-1/2 h-1 w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="text-center relative">
                <div className="bg-white w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10 border border-gray-100">
                  <Zap className="h-10 w-10 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Create & Upload</h3>
                <p className="text-gray-600">
                  Content creators upload their educational materials to the platform, setting their desired base price.
                </p>
              </div>
              
              <div className="text-center relative">
                <div className="bg-white w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10 border border-gray-100">
                  <Lock className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Secure Transaction</h3>
                <p className="text-gray-600">
                  Smart contracts handle purchases securely, with funds held in escrow until content delivery is confirmed.
                </p>
              </div>
              
              <div className="text-center relative">
                <div className="bg-white w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 relative z-10 border border-gray-100">
                  <Coins className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Earn & Learn</h3>
                <p className="text-gray-600">
                  Creators earn cryptocurrency for their content, while learners gain access to valuable skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-indigo-100">Everything you need to learn, teach, and grow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors duration-300">
                <div className="text-white mb-6 bg-white/10 w-16 h-16 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-indigo-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 lg:p-16 text-center text-white shadow-xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto text-blue-100">
              Whether you're looking to share your knowledge or acquire new skills, SkillzzyFi offers a revolutionary platform for decentralized learning.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/create" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/explore" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300">
                Browse Content
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold">
                Skillzzy<span className="text-yellow-400">Fi</span>
              </div>
              <p className="text-gray-400 mt-2">The Future of Decentralized Education</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} SkillzzyFi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;