import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black text-[#F9FAFB] font-inter">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-poppins font-bold mb-6 text-[#06D6A0] drop-shadow-[0_0_20px_rgba(6,214,160,0.6)]"
        >
          About SkillzzyFi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-3xl mx-auto text-lg md:text-xl text-[#9CA3AF]"
        >
          A decentralized marketplace where knowledge is currency. SkillzzyFi empowers
          creators to share, learners to grow, and the world to exchange skills
          without barriers.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#111827] rounded-2xl p-8 shadow-lg border border-[#1f2937] hover:shadow-[0_0_20px_rgba(6,214,160,0.5)]"
        >
          <h2 className="text-3xl font-poppins font-bold text-[#3B82F6] mb-4">Our Mission</h2>
          <p className="text-[#9CA3AF] leading-relaxed">
            To democratize access to skills and knowledge by creating a
            transparent, blockchain-powered ecosystem where creators are fairly
            rewarded and learners unlock limitless growth opportunities.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#111827] rounded-2xl p-8 shadow-lg border border-[#1f2937] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        >
          <h2 className="text-3xl font-poppins font-bold text-[#A855F7] mb-4">Our Vision</h2>
          <p className="text-[#9CA3AF] leading-relaxed">
            To become the global hub for peer-to-peer learning, where every
            individual has the power to teach, learn, and grow through
            decentralized technology.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-poppins font-bold text-center mb-12 text-[#FACC15] drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Transparency",
              desc: "Every transaction is visible, secure, and verifiable on the blockchain.",
              color: "#06D6A0",
            },
            {
              title: "Empowerment",
              desc: "Creators earn fairly, and learners access knowledge without intermediaries.",
              color: "#3B82F6",
            },
            {
              title: "Community",
              desc: "A thriving network of learners and creators shaping the future together.",
              color: "#A855F7",
            },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-[#111827] p-8 rounded-2xl shadow-md border border-[#1f2937]"
            >
              <h3
                className="text-2xl font-poppins font-bold mb-3"
                style={{ color: value.color }}
              >
                {value.title}
              </h3>
              <p className="text-[#9CA3AF]">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="text-center py-20 px-6 bg-[#111827]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-poppins font-bold mb-6 text-[#06D6A0]"
        >
          Join the Future of Learning
        </motion.h2>
        <p className="max-w-2xl mx-auto text-[#9CA3AF] mb-8">
          Be a part of the decentralized revolution. Whether you are a creator or
          a learner, SkillzzyFi is your gateway to a limitless world of
          knowledge.
        </p>
        <motion.a
          whileHover={{ scale: 1.1 }}
          href="/"
          className="px-8 py-3 bg-[#06D6A0] text-[#0B0F1A] font-poppins font-semibold rounded-xl shadow-[0_0_20px_rgba(6,214,160,0.6)] hover:bg-[#3B82F6] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition"
        >
          Get Started
        </motion.a>
      </section>
    </div>
  );
}