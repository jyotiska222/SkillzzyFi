import React from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { EffectComposer, Glitch, Bloom } from "@react-three/postprocessing";
import { FaArrowRight, FaCode, FaPaintBrush, FaMusic } from "react-icons/fa";

// 3D Skill Icons Component
// const SkillIcons = () => {
//   return (
//     <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
//       <ambientLight intensity={0.3} />
//       <pointLight position={[10, 10, 10]} intensity={2} />
//       <Environment preset="city" />

//       {/* Neon Box */}
//       <Float speed={2} rotationIntensity={1} floatIntensity={2}>
//         <mesh position={[-2, 1, 0]}>
//           <boxGeometry args={[1, 1, 1]} />
//           <meshStandardMaterial
//             color="#00df9a"
//             emissive="#00df9a"
//             emissiveIntensity={1}
//             roughness={0.2}
//             metalness={0.8}
//           />
//         </mesh>
//       </Float>

//       {/* Neon Sphere */}
//       <Float speed={3} rotationIntensity={2} floatIntensity={1}>
//         <mesh position={[2, -1, 0]}>
//           <sphereGeometry args={[0.9, 32, 32]} />
//           <meshStandardMaterial
//             color="#6366f1"
//             emissive="#6366f1"
//             emissiveIntensity={1}
//             roughness={0.1}
//             metalness={1}
//           />
//         </mesh>
//       </Float>

//       {/* Neon Torus */}
//       <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
//         <mesh position={[0, 0, 0]}>
//           <torusGeometry args={[0.6, 0.2, 16, 32]} />
//           <meshStandardMaterial
//             color="#f59e0b"
//             emissive="#f59e0b"
//             emissiveIntensity={1}
//             roughness={0.2}
//             metalness={0.7}
//           />
//         </mesh>
//       </Float>

//       <EffectComposer>
//         <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
//         <Glitch
//           delay={[1.5, 3.5]}
//           duration={[0.6, 1.0]}
//           strength={[0.1, 0.2]}
//           mode="sporadic"
//           active
//         />
//       </EffectComposer>
//       <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
//     </Canvas>
//   );
// };

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-24 sm:pb-32 overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        {/* <SkillIcons /> */}
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 flex justify-center lg:justify-start items-center gap-3"
            >
              <div className="px-3 py-1 bg-emerald-900/40 text-emerald-400 rounded-full text-xs sm:text-sm font-medium border border-emerald-400/30 shadow-md shadow-emerald-500/20">
                NEW PLATFORM
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">
                Join our beta today
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 drop-shadow-[0_0_25px_rgba(0,255,200,0.5)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="block">Trade Skills,</span>
              <span className="block">Not Money</span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              The ultimate platform for skill exchange. Teach what you know,
              learn what you need — all without spending a dime.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base hover:shadow-xl hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 hover:scale-105">
                Get Started <FaArrowRight />
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900/60 backdrop-blur-md rounded-full font-semibold border border-gray-800 text-sm sm:text-base hover:bg-gray-800/70 hover:shadow-lg hover:shadow-purple-500/20 transition-all transform hover:-translate-y-1 hover:scale-105">
                Watch Demo
              </button>
            </motion.div>

            {/* Avatars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-10 flex justify-center lg:justify-start items-center gap-3 sm:gap-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden hover:scale-110 transition-transform"
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/${
                        item % 2 === 0 ? "women" : "men"
                      }/${item + 20}.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-gray-400 text-sm sm:text-base">
                <span className="text-white font-medium">1,200+</span>{" "}
                professionals already trading
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-1/2 relative w-full"
          >
            <div className="relative w-full aspect-[1.1] max-w-sm sm:max-w-md lg:max-w-xl mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl backdrop-blur-md border border-gray-800/50 shadow-2xl"
                animate={{
                  rotate: [0, 1, -1, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />

              <motion.img
                src="https://illustrations.popsy.co/amber/digital-nomad.svg"
                alt="Skill Sharing"
                className="absolute inset-0 w-full h-full object-contain p-4 sm:p-6 lg:p-8 drop-shadow-[0_0_25px_rgba(0,255,200,0.3)]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />

              {/* Floating skill tags */}
              <motion.div
                className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-gray-900/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-800 flex items-center gap-2 text-xs sm:text-sm hover:scale-105 transition-transform"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <FaCode className="text-emerald-400" />
                <span className="text-white font-medium">Development</span>
              </motion.div>

              <motion.div
                className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-gray-900/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-800 flex items-center gap-2 text-xs sm:text-sm hover:scale-105 transition-transform"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <FaPaintBrush className="text-purple-400" />
                <span className="text-white font-medium">Design</span>
              </motion.div>

              <motion.div
                className="absolute top-1/4 -left-8 sm:-left-10 bg-gray-900/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-800 flex items-center gap-2 text-xs sm:text-sm hover:scale-105 transition-transform"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <FaMusic className="text-yellow-400" />
                <span className="text-white font-medium">Music</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
